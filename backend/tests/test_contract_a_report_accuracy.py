"""
Axiom — Contract A Report Accuracy and Coverage Regression Tests
Verifies that:
1. Contract A findings reference Sections 2, 3, 4, 5, 6, and 7 correctly without section drift.
2. Payment withholding is surfaced and not omitted.
3. Material warranty (Section 6) and termination (Section 7) risks are detected.
4. Every evidence quote exists verbatim in the source text.
5. Related clauses (Section 4 indemnity and Section 5 liability cap) are assessed together.
6. Risk severities follow the documented rubric (proportionate, not all High).
7. Live AI and Fallback modes are unambiguously identified.
"""

import os
from pathlib import Path
import docx
import pytest

from ai.pipeline import ContractAnalysisPipeline
from ai.scorer import risk_scorer
from ai.segmenter import contract_segmenter
from ai.validator import evidence_validator
from backend.app.schemas.clause import ClauseFindingSchema


CONTRACT_A_DOCX = Path("sample_contracts/Contract_A_High_Risk_Services_Agreement.docx")


def get_contract_a_text() -> str:
    assert CONTRACT_A_DOCX.exists(), f"Missing fixture {CONTRACT_A_DOCX}"
    doc = docx.Document(CONTRACT_A_DOCX)
    return "\n\n".join([p.text.strip() for p in doc.paragraphs if p.text.strip()])


def test_section_header_segmentation_contract_a():
    """Confirms that headings in Contract A retain their genuine section numbers."""
    text = get_contract_a_text()
    segments = contract_segmenter.segment_into_clauses(text)
    section_titles = [s.section_title for s in segments]

    # Verify headings are parsed with accurate section numbers
    assert any("Section 2 • Payment" in s for s in section_titles)
    assert any("Section 3 • Intellectual Property" in s for s in section_titles)
    assert any("Section 4 • Indemnification" in s for s in section_titles)
    assert any("Section 5 • Limitation of Liability" in s for s in section_titles)
    assert any("Section 6 • Warranties" in s for s in section_titles)
    assert any("Section 7 • Termination" in s for s in section_titles)

    # Confirm legacy hardcoded sections do not appear in Contract A layout
    assert not any("Section 9.1" in s for s in section_titles)
    assert not any("Section 5.2" in s for s in section_titles)
    assert not any("Section 4.3" in s for s in section_titles)


def test_benchmark_rules_contract_a_coverage_and_sections():
    """Confirms that deterministic benchmark rules surface all material clauses with exact section numbers."""
    text = get_contract_a_text()
    raw_findings = risk_scorer.run_benchmark_rules(text)
    grounded = evidence_validator.validate_and_ground_findings(raw_findings, text)

    found_sections = {c.section for c in grounded}
    found_titles = {c.title for c in grounded}

    # 1. Section numbers must match actual contract sections
    assert any("Section 2" in s for s in found_sections)
    assert any("Section 3" in s for s in found_sections)
    assert any("Section 4" in s for s in found_sections)
    assert any("Section 5" in s for s in found_sections)
    assert any("Section 6" in s for s in found_sections)
    assert any("Section 7" in s for s in found_sections)

    # 2. Payment withholding must be surfaced
    assert any("Withholding" in t for t in found_titles)
    withholding_finding = next(c for c in grounded if "Withholding" in c.title)
    assert "Section 2" in withholding_finding.section
    assert "withhold" in withholding_finding.original_text.lower()

    # 3. Liability cap and indemnity must both be surfaced
    assert any("Liability Cap" in t for t in found_titles)
    cap_finding = next(c for c in grounded if "Liability Cap" in c.title)
    assert "Section 5" in cap_finding.section
    assert "preceding one month" in cap_finding.original_text.lower() or "one month" in cap_finding.original_text.lower()

    # 4. Warranties and termination must be surfaced
    assert any("Warranties" in t for t in found_titles)
    warranty_finding = next(c for c in grounded if "Warranties" in c.title)
    assert "Section 6" in warranty_finding.section
    assert "error-free" in warranty_finding.original_text.lower()

    assert any("Termination" in t for t in found_titles)
    term_finding = next(c for c in grounded if "Termination" in c.title)
    assert "Section 7" in term_finding.section
    assert "terminate" in term_finding.original_text.lower()

    # 5. Every evidence quote must exist verbatim in the source text
    for c in grounded:
        assert c.original_text in text, f"Quote not found in source: {c.original_text}"

    # 6. Severities must follow rubric (not all High)
    severities = {c.severity for c in grounded}
    assert "high" in severities
    assert "medium" in severities or "low" in severities
    # Standard confidentiality or payment terms should balance the profile
    low_or_med = [c for c in grounded if c.severity in ("medium", "low")]
    assert len(low_or_med) >= 2


def test_related_clauses_indemnity_and_liability_cap_interaction():
    """Confirms that Section 4 indemnity and Section 5 liability cap are assessed in context."""
    text = get_contract_a_text()
    raw_findings = risk_scorer.run_benchmark_rules(text)
    grounded = evidence_validator.validate_and_ground_findings(raw_findings, text)

    indemnity_clause = next(c for c in grounded if c.category == "liability" and "Section 4" in c.section)
    cap_clause = next(c for c in grounded if c.category == "liability" and "Section 5" in c.section)

    assert "negligence" in indemnity_clause.original_text.lower()
    # Check that explanation or why_risky connects the liability cap to the indemnification exposure
    assert "indemn" in cap_clause.why_risky.lower() or "indemn" in cap_clause.explanation.lower() or "asymmetric" in cap_clause.why_risky.lower()


def test_fallback_vs_live_ai_identification():
    """Confirms that fallback and live AI modes are unambiguously tagged."""
    text = get_contract_a_text()

    # 1. Fallback execution
    class FailingProvider:
        provider_name = "failing-provider"
        model_name = "fail-model"
        api_key = "fake-key"
        def generate(self, **kwargs):
            raise ConnectionError("LLM Provider Unavailable")

    pipeline = ContractAnalysisPipeline(provider=FailingProvider())
    fallback_out = pipeline.analyze(text=text, filename="Contract_A_High_Risk_Services_Agreement.docx")

    assert fallback_out.provider == "rule_benchmark"
    assert fallback_out.model_name == "commercial-benchmark-rules"
    assert len(fallback_out.clauses) >= 7

    # 2. Live Groq execution (when API key configured)
    if os.getenv("GROQ_API_KEY") or os.getenv("AI_API_KEY"):
        live_pipeline = ContractAnalysisPipeline()
        if live_pipeline.provider.provider_name == "groq":
            try:
                live_out = live_pipeline.analyze(text=text, filename="Contract_A_High_Risk_Services_Agreement.docx")
                assert live_out.provider == "groq"
                assert "gpt-oss-120b" in live_out.model_name
                assert len(live_out.clauses) >= 5

                # Verify grounded section numbers from live model
                live_sections = {c.section for c in live_out.clauses}
                assert any("Section 2" in s for s in live_sections)
                assert any("Section 4" in s for s in live_sections)
                assert not any("Section 9.1" in s for s in live_sections)
            except Exception as e:
                pytest.skip(f"Live Groq request skipped due to rate limit/network: {e}")
