"""
Axiom AI Contract Intelligence Pipeline End-to-End Tests
Tests end-to-end analysis, prompt dispatch, graceful fallbacks,
risk sensitivity, redlines, and document comparison.
"""

from ai.pipeline import ContractAnalysisPipeline
from ai.providers.mock import MockProvider


SAMPLE_CONTRACT_TEXT = """--- PAGE 1 ---
CONSULTING SERVICES AGREEMENT
Effective Date: October 2026

Section 4.3 • Fees and Payment Schedule
Invoices shall be payable within ninety (90) days following formal acceptance of undisputed milestones.

Section 5.2 • Intellectual Property Ownership
All deliverables, inventions, discoveries, and work product developed or conceived by Contractor, whether alone or jointly with others, shall be the sole and exclusive property of Client from inception without reservation.

--- PAGE 2 ---
Section 8.1 • Termination
Client may terminate this Agreement or any Statement of Work at any time for convenience upon two (2) days prior written notice without penalty or further obligation.

Section 9.1 • Liability and Indemnification
Contractor shall defend, indemnify, and hold harmless Client and affiliates against any and all claims, liabilities, losses, damages, costs, and expenses arising out of Contractor's deliverables or breach of any representation.

Section 11.2 • Restrictive Covenants
During the Term and for twelve (12) months thereafter, Contractor shall not provide consulting or design services to any entity operating in Client's commercial sector.
"""


def test_pipeline_analyzes_with_mock_provider():
    pipeline = ContractAnalysisPipeline(provider=MockProvider())
    result = pipeline.analyze(
        text=SAMPLE_CONTRACT_TEXT,
        filename="Sample_Consulting_Contract.pdf",
        risk_sensitivity="standard",
    )

    assert result.risk_counts.high >= 1
    assert len(result.clauses) > 0
    assert result.summary is not None

    # Check clause schema fidelity
    first = result.clauses[0]
    assert first.severity in ["high", "medium", "low", "info"]
    assert first.category in ["liability", "payment", "ip", "termination", "warranty", "confidentiality", "governing_law"]
    assert len(first.original_text) > 0
    assert len(first.explanation) > 0
    assert len(first.suggested_revision) > 0


def test_pipeline_graceful_fallback_on_provider_timeout():
    # Configure pipeline with a failing provider (simulated timeout)
    failing_provider = MockProvider(failure_mode="timeout")
    pipeline = ContractAnalysisPipeline(provider=failing_provider)

    # Pipeline must gracefully fall back to deterministic benchmark rules without crashing
    result = pipeline.analyze(
        text=SAMPLE_CONTRACT_TEXT,
        filename="Timeout_Contract.pdf",
    )

    assert len(result.clauses) >= 3
    assert result.risk_counts.high >= 1
    # Check that indemnity was identified by deterministic benchmark
    titles = [c.title for c in result.clauses]
    assert any("Indemnif" in t for t in titles)


def test_pipeline_handles_empty_document():
    pipeline = ContractAnalysisPipeline(provider=MockProvider())
    result = pipeline.analyze(text="", filename="Empty.pdf")

    assert result.risk_counts.info == 1
    assert len(result.clauses) == 1
    assert "no readable text" in result.clauses[0].explanation.lower() or "empty" in result.clauses[0].title.lower()


def test_pipeline_handles_scanned_notice():
    pipeline = ContractAnalysisPipeline(provider=MockProvider())
    scanned_text = "[Scanned or image-based PDF document: 3 pages detected without embedded text layer]"
    result = pipeline.analyze(text=scanned_text, filename="Scanned.pdf")

    assert result.risk_counts.info == 1
    assert "scanned" in result.clauses[0].title.lower() or "scanned" in result.summary.lower()


def test_pipeline_risk_sensitivity_calibration():
    pipeline = ContractAnalysisPipeline(provider=MockProvider())
    # Standard vs Strict
    res_standard = pipeline.analyze(text=SAMPLE_CONTRACT_TEXT, filename="Test.pdf", risk_sensitivity="standard")
    res_strict = pipeline.analyze(text=SAMPLE_CONTRACT_TEXT, filename="Test.pdf", risk_sensitivity="strict")

    # Strict mode should escalate medium risks into high
    assert res_strict.risk_counts.high >= res_standard.risk_counts.high


def test_pipeline_compare_documents():
    pipeline = ContractAnalysisPipeline(provider=MockProvider())
    diffs = pipeline.compare_documents(
        original_title="Original.pdf",
        original_text=SAMPLE_CONTRACT_TEXT,
        revised_title="CounterProposal.pdf",
        revised_text=SAMPLE_CONTRACT_TEXT.replace("ninety (90) days", "thirty (30) days"),
    )

    assert len(diffs) > 0
    first = diffs[0]
    assert first.change_type in ["modified", "added", "removed", "conflict"]
    assert first.severity in ["high", "medium", "low", "info"]
    assert len(first.explanation) > 0
    assert len(first.legal_impact) > 0
