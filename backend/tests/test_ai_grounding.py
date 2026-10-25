"""
Axiom AI Evidence Grounding & Citation Tests
Verifies that all findings must physically exist in source text,
hallucinated excerpts are rejected, and page numbers are grounded in extraction metadata.
"""

from ai.schemas import RawClauseFinding
from ai.validator import evidence_validator


SOURCE_CONTRACT = """--- PAGE 1 ---
MASTER SERVICES AGREEMENT
This Agreement is entered into between Client Inc and Alex Mercer (Contractor).

Section 4.3 • Fees and Invoices
Invoices shall be payable within ninety (90) days following Client's written acceptance.

--- PAGE 2 ---
Section 9.1 • Indemnification
Contractor shall defend, indemnify, and hold harmless Client against any and all claims, liabilities, and damages.
"""


def test_grounded_excerpt_accepted_and_anchored_to_page():
    raw_finding = RawClauseFinding(
        title="Extended Payment Terms",
        category="payment",
        severity="medium",
        source_excerpt="Invoices shall be payable within ninety (90) days",
        section="Section 4.3",
        page_number=1,
        plain_english_explanation="Payment is delayed 90 days.",
        why_it_matters="Cash flow delay.",
        recommended_action="Change to Net 30.",
        suggested_counter_clause="Net 30 days.",
    )

    validated = evidence_validator.validate_and_ground_findings(
        raw_findings=[raw_finding],
        source_text=SOURCE_CONTRACT,
    )

    assert len(validated) == 1
    finding = validated[0]
    assert finding.title == "Extended Payment Terms"
    assert finding.page_number == 1
    assert "Invoices shall be payable within ninety (90) days" in finding.original_text


def test_hallucinated_excerpt_is_rejected():
    hallucinated_finding = RawClauseFinding(
        title="Fabricated Non-Compete",
        category="confidentiality",
        severity="high",
        source_excerpt="Contractor shall not engage in any competing artificial intelligence business worldwide for 10 years",
        section="Section 99 • Fabricated",
        page_number=5,
        plain_english_explanation="Fabricated clause.",
        why_it_matters="Fabricated.",
    )

    validated = evidence_validator.validate_and_ground_findings(
        raw_findings=[hallucinated_finding],
        source_text=SOURCE_CONTRACT,
    )

    # Hallucinated finding must be completely rejected by the evidence validator
    assert len(validated) == 0


def test_page_number_grounding_repaired_from_source():
    # If the model claims page 99, but excerpt is physically on PAGE 2
    misanchored_finding = RawClauseFinding(
        title="Unlimited Indemnification",
        category="liability",
        severity="high",
        source_excerpt="defend, indemnify, and hold harmless Client",
        section="Section 9.1",
        page_number=99,  # Incorrect model guess
        plain_english_explanation="Client indemnity.",
        why_it_matters="Exposure.",
    )

    validated = evidence_validator.validate_and_ground_findings(
        raw_findings=[misanchored_finding],
        source_text=SOURCE_CONTRACT,
    )

    assert len(validated) == 1
    # EvidenceValidator must ground it to Page 2 where the text actually lives
    assert validated[0].page_number == 2
