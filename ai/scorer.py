"""
Axiom Risk Scoring & Benchmark Rubric Engine
Calibrates risk severity according to user sensitivity, assigns canonical categories,
and generates plain-English explanations and balanced counter-proposals.
"""

import re
from typing import List, Optional, Tuple

from ai.schemas import ClauseCategory, RawClauseFinding, RiskSeverity
from backend.app.core.logging import logger


class RiskScorer:
    """Evaluates contractual clauses against independent contractor benchmarks."""

    VALID_CATEGORIES: List[ClauseCategory] = [
        "liability",
        "payment",
        "ip",
        "termination",
        "warranty",
        "confidentiality",
        "governing_law",
    ]

    VALID_SEVERITIES: List[RiskSeverity] = ["high", "medium", "low", "info"]

    def normalize_category(self, raw_category: Optional[str]) -> str:
        """Maps arbitrary category string to canonical schema category."""
        if not raw_category:
            return "liability"
        cat = raw_category.lower().strip().replace(" ", "_").replace("-", "_")
        if cat in self.VALID_CATEGORIES:
            return cat
        if any(term in cat for term in ["indemn", "liabilit", "damages"]):
            return "liability"
        if any(term in cat for term in ["pay", "fee", "invoice", "compensation"]):
            return "payment"
        if any(term in cat for term in ["intellectual", "ip", "copyright", "ownership", "work_for_hire"]):
            return "ip"
        if any(term in cat for term in ["term", "cancell", "convenience"]):
            return "termination"
        if any(term in cat for term in ["warrant", "guarantee", "remed"]):
            return "warranty"
        if any(term in cat for term in ["confidential", "nda", "non_compete", "solicit", "restrictive"]):
            return "confidentiality"
        if any(term in cat for term in ["law", "jurisdiction", "dispute", "arbitration"]):
            return "governing_law"
        return "liability"

    def calibrate_severity(
        self,
        base_severity: str,
        category: str,
        risk_sensitivity: str = "standard",
    ) -> RiskSeverity:
        """Calibrates severity based on contractor risk sensitivity preference."""
        sev = base_severity.lower().strip()
        if sev not in self.VALID_SEVERITIES:
            sev = "medium"

        if risk_sensitivity == "strict":
            if sev == "medium":
                return "high"
            if sev == "low":
                return "medium"
            if sev == "info":
                return "low"
            return "high"
        elif risk_sensitivity == "relaxed":
            if sev == "high" and category not in ["liability", "ip"]:
                return "medium"
            if sev == "medium":
                return "low"
            if sev == "low":
                return "info"
            return sev
        return sev  # type: ignore

    def run_benchmark_rules(
        self,
        text: str,
        risk_sensitivity: str = "standard",
        explanation_style: str = "plain_english",
        auto_generate_redlines: bool = True,
    ) -> List[RawClauseFinding]:
        """Runs the deterministic rule engine as a source-grounded fallback."""
        findings: List[RawClauseFinding] = []
        lower_text = text.lower()

        # 1. Unlimited Indemnification
        indemnity_pattern = re.compile(
            r"(?i)(defend,\s*indemnify,\s*and\s*hold\s*harmless[^\.\n]+(?:\.|\n|;))"
        )
        indemnity_match = indemnity_pattern.search(text)
        if indemnity_match or any(k in lower_text for k in ["indemnif", "hold harmless"]):
            excerpt = (
                indemnity_match.group(1).strip()
                if indemnity_match
                else self._find_surrounding_sentence(text, "indemnif")
            )
            findings.append(
                RawClauseFinding(
                    title="Unlimited Indemnification Exposure",
                    category="liability",
                    severity=self.calibrate_severity("high", "liability", risk_sensitivity),
                    source_excerpt=excerpt,
                    section="Section 9.1 • Liability & Indemnity",
                    plain_english_explanation=(
                        "You are agreeing to pay all of the client's lawsuits, legal bills, and losses "
                        "out of your own pocket without any dollar limit—even for minor unintended mistakes."
                    ),
                    why_it_matters=(
                        "A single disputed bug or project delay could expose you to six-figure damages "
                        "far exceeding the total fees paid under the contract."
                    ),
                    recommended_action="Insert a mutual liability cap tied to total fees paid, and limit indemnity to gross negligence.",
                    suggested_counter_clause=(
                        "Each party shall indemnify the other against direct third-party claims arising from gross negligence "
                        "or willful misconduct, provided Contractor's aggregate liability shall be capped at the total fees paid under this Agreement."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 2. Broad IP Assignment & Background Tools
        ip_pattern = re.compile(
            r"(?i)(all\s+(?:right,\s*title,\s*and\s*interest|intellectual\s+property)[^\.\n]+(?:\.|\n|;))"
        )
        ip_match = ip_pattern.search(text)
        if ip_match or any(k in lower_text for k in ["work made for hire", "assigns all rights", "intellectual property"]):
            excerpt = (
                ip_match.group(1).strip()
                if ip_match
                else self._find_surrounding_sentence(text, "intellectual property")
            )
            findings.append(
                RawClauseFinding(
                    title="Broad Intellectual Property Assignment",
                    category="ip",
                    severity=self.calibrate_severity("high", "ip", risk_sensitivity),
                    source_excerpt=excerpt,
                    section="Section 5.2 • Intellectual Property",
                    plain_english_explanation=(
                        "The client claims complete ownership of everything you create, potentially including "
                        "your pre-existing code libraries, starter kits, design templates, and workflow tools."
                    ),
                    why_it_matters="You could forfeit the legal right to reuse your standard toolkits with future commercial clients.",
                    recommended_action="Carve out pre-existing background technology and grant the client an exclusive license to final bespoke deliverables upon full payment.",
                    suggested_counter_clause=(
                        "Client shall own custom deliverables upon receipt of full payment. Contractor retains all ownership "
                        "of pre-existing tools, libraries, frameworks, and reusable know-how."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 3. Payment Schedule (Net-60 / Net-90 / Extended Payment)
        payment_pattern = re.compile(
            r"(?i)(net\s*(?:60|90|120)|payment[^\.\n]+within\s*(?:60|90|120)\s*days)"
        )
        payment_match = payment_pattern.search(text)
        if payment_match or any(k in lower_text for k in ["net 60", "net 90", "net-60", "net-90", "90 days"]):
            excerpt = (
                payment_match.group(1).strip()
                if payment_match
                else self._find_surrounding_sentence(text, "payment")
            )
            findings.append(
                RawClauseFinding(
                    title="Extended Payment Terms (Net-60/90)",
                    category="payment",
                    severity=self.calibrate_severity("medium", "payment", risk_sensitivity),
                    source_excerpt=excerpt,
                    section="Section 4.3 • Fees and Payment",
                    plain_english_explanation="Payment is delayed 60 to 90 days after delivery, forcing you to act as an interest-free bank for the client.",
                    why_it_matters="Extended payment cycles create severe cashflow vulnerability and heighten collection risks.",
                    recommended_action="Negotiate payment within thirty (30) days of invoice date, plus standard late interest.",
                    suggested_counter_clause=(
                        "All invoices shall be due and payable within thirty (30) days of receipt. Past-due balances "
                        "shall accrue interest at 1.5% per month."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 4. Asymmetric Termination for Convenience
        term_pattern = re.compile(
            r"(?i)(terminate[^\.\n]+for\s+convenience[^\.\n]+(?:\.|\n|;))"
        )
        term_match = term_pattern.search(text)
        if term_match or any(k in lower_text for k in ["for convenience", "without cause"]):
            excerpt = (
                term_match.group(1).strip()
                if term_match
                else self._find_surrounding_sentence(text, "terminate")
            )
            findings.append(
                RawClauseFinding(
                    title="Asymmetric Termination for Convenience",
                    category="termination",
                    severity=self.calibrate_severity("medium", "termination", risk_sensitivity),
                    source_excerpt=excerpt,
                    section="Section 8.1 • Termination",
                    plain_english_explanation="The client can terminate the engagement abruptly without paying for reserved time or work in progress.",
                    why_it_matters="Leaves you with immediate lost billable hours after turning down other project opportunities.",
                    recommended_action="Require bilateral 30 days notice and payment for all completed work and non-cancelable commitments.",
                    suggested_counter_clause=(
                        "Either party may terminate for convenience upon thirty (30) days written notice. Client shall compensate "
                        "Contractor for all work performed up to the effective termination date."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 5. Restrictive Non-Compete Covenants
        nc_pattern = re.compile(
            r"(?i)(non-compete|competing\s+business|shall\s+not\s+(?:engage\s+in|provide\s+services\s+to)[^\.\n]+(?:\.|\n|;))"
        )
        nc_match = nc_pattern.search(text)
        if nc_match or any(k in lower_text for k in ["non-compete", "compete"]):
            excerpt = (
                nc_match.group(1).strip()
                if nc_match
                else self._find_surrounding_sentence(text, "compete")
            )
            findings.append(
                RawClauseFinding(
                    title="Restrictive Non-Compete Covenant",
                    category="confidentiality",
                    severity=self.calibrate_severity("high", "confidentiality", risk_sensitivity),
                    source_excerpt=excerpt,
                    section="Section 11.2 • Restrictive Covenants",
                    plain_english_explanation="Prevents you from taking clients in your specialized industry after the contract concludes.",
                    why_it_matters="Restricts trade and earning capacity as an independent specialist.",
                    recommended_action="Strike non-compete language entirely in favor of standard confidentiality protection.",
                    suggested_counter_clause=(
                        "Contractor agrees only to maintain strict confidentiality. All non-competition restrictions shall be stricken in their entirety."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 6. Uncapped Warranty Survival
        warranty_pattern = re.compile(r"(?i)(warrants?\s+and\s+represents?[^\.\n]+(?:\.|\n|;))")
        warranty_match = warranty_pattern.search(text)
        if warranty_match or "warranty" in lower_text:
            excerpt = (
                warranty_match.group(1).strip()
                if warranty_match
                else self._find_surrounding_sentence(text, "warranty")
            )
            findings.append(
                RawClauseFinding(
                    title="Uncapped Deliverable Warranty",
                    category="warranty",
                    severity=self.calibrate_severity("low", "warranty", risk_sensitivity),
                    source_excerpt=excerpt,
                    section="Section 7.1 • Warranties",
                    plain_english_explanation="Requires bug-free performance without clear time limit or remedy ceiling.",
                    why_it_matters="Allows client to demand infinite free maintenance months or years later.",
                    recommended_action="Limit warranty duration to 30 or 60 days following acceptance.",
                    suggested_counter_clause=(
                        "Contractor warrants deliverables conform to agreed specifications for thirty (30) days following delivery. "
                        "Remedy is limited to commercially reasonable re-performance."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="medium",
                    needs_human_review=True,
                )
            )

        return findings

    def _find_surrounding_sentence(self, text: str, keyword: str) -> str:
        """Finds sentence containing the keyword in text."""
        sentences = re.split(r"(?<=[.!?])\s+", text)
        for s in sentences:
            if keyword.lower() in s.lower():
                return s.strip()
        return f"Provisions regarding {keyword} referenced in contract."


risk_scorer = RiskScorer()
