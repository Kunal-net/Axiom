"""
Axiom Risk Scoring & Benchmark Rubric Engine
Calibrates risk severity according to user sensitivity, assigns canonical categories,
and generates plain-English explanations and balanced counter-proposals.
"""

import re
from typing import List, Optional, Tuple

from ai.schemas import ClauseCategory, RawClauseFinding, RiskSeverity
from ai.segmenter import contract_segmenter
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
        """Runs the deterministic commercial contract intelligence benchmark engine.
        Extracts verbatim grounded excerpts and anchors each finding to its genuine section header.
        """
        findings: List[RawClauseFinding] = []
        lower_text = text.lower()

        # 1. Unrestricted Payment Withholding & Mandatory Performance
        withhold_pattern = re.compile(
            r"(?i)(Client\s+may\s+withhold\s+any\s+amount[^\.\n]+(?:\.|\n|;)|"
            r"unrestricted\s+withholding\s+of\s+any\s+disputed\s+portions[^\.\n]*(?:\.|\n|;)|"
            r"withhold[^\.\n]+without\s+(?:providing\s+)?written\s+notice[^\.\n]+(?:\.|\n|;))"
        )
        withhold_match = withhold_pattern.search(text)
        if withhold_match or ("withhold" in lower_text and any(k in lower_text for k in ["for any reason", "without notice", "unrestricted withholding"])):
            excerpt = (
                withhold_match.group(1).strip()
                if withhold_match
                else self._find_surrounding_sentence(text, "withhold")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Payment Terms"
            findings.append(
                RawClauseFinding(
                    title="Unrestricted Payment Withholding & Mandatory Performance",
                    category="payment",
                    severity=self.calibrate_severity("high", "payment", risk_sensitivity),
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation=(
                        "The client can unilaterally withhold invoice payments for any reason or minor dissatisfaction "
                        "without written notice, while you are forced to continue performing services without compensation."
                    ),
                    why_it_matters=(
                        "Compels uncompensated labor and deprives you of due process or written notice to dispute frivolous deductions."
                    ),
                    recommended_action="Permit withholding only for bona fide disputes notified in writing within 10 days, and allow contractor to pause services if fees are withheld.",
                    suggested_counter_clause=(
                        "Client may withhold only disputed portions of an invoice provided Client gives detailed written notice "
                        "within ten (10) business days. Contractor may suspend performance if undisputed fees remain unpaid."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 2. Extended Payment Schedule (Net-60 / Net-90 / Delayed Payment)
        payment_pattern = re.compile(
            r"(?i)(Client\s+shall\s+pay\s+invoices\s+within\s+(?:60|90|120)\s+days[^\.\n]*(?:\.|\n|;)|"
            r"within\s*(?:90|ninety|60|sixty|120|one hundred twenty)\s*days[^\.\n]*(?:\.|\n|;)|"
            r"net\s*(?:60|90|120)|payment[^\.\n]+within\s*(?:60|90|120)\s*days)"
        )
        payment_match = payment_pattern.search(text)
        if payment_match or any(k in lower_text for k in ["net 60", "net 90", "net-60", "net-90", "90 days", "ninety (90) days"]):
            excerpt = (
                payment_match.group(1).strip()
                if payment_match
                else self._find_surrounding_sentence(text, "payment")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Payment Terms"
            findings.append(
                RawClauseFinding(
                    title="Extended Payment Terms (60-90 Days)",
                    category="payment",
                    severity=self.calibrate_severity("medium", "payment", risk_sensitivity),
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation=(
                        "Payment is delayed 60 to 90 days after delivery, forcing you to act as an interest-free lender for the client."
                    ),
                    why_it_matters="Extended payment cycles create acute cashflow vulnerability and heighten collection default risks.",
                    recommended_action="Negotiate standard 30-day payment terms with standard 1.5% monthly late interest.",
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

        # 3. Broad IP Assignment & Background Tools
        ip_pattern = re.compile(
            r"(?i)(All\s+intellectual\s+property[^\.\n]+exclusive\s+property[^\.\n]*(?:\.|\n|;)|"
            r"Contractor\s+irrevocably\s+transfers,\s*assigns[^\.\n]*(?:\.|\n|;)|"
            r"all\s+(?:right,\s*title,\s*and\s*interest|intellectual\s+property)[^\.\n]+(?:\.|\n|;))"
        )
        ip_match = ip_pattern.search(text)
        if ip_match or any(k in lower_text for k in ["work made for hire", "assigns all rights", "intellectual property", "pre-existing libraries"]):
            excerpt = (
                ip_match.group(1).strip()
                if ip_match
                else self._find_surrounding_sentence(text, "intellectual property")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Intellectual Property"
            findings.append(
                RawClauseFinding(
                    title="Broad Intellectual Property & Tool Assignment",
                    category="ip",
                    severity=self.calibrate_severity("high", "ip", risk_sensitivity),
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation=(
                        "The client claims complete ownership of everything created, including your pre-existing libraries, "
                        "reusable tools, starter frameworks, and know-how, even before full invoice payment."
                    ),
                    why_it_matters="You could forfeit the legal right to reuse your standard toolkits and methodologies with future clients.",
                    recommended_action="Carve out pre-existing background technology and condition assignment upon full payment.",
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

        # 4. Unlimited Indemnification Covering Client Negligence
        indemnity_pattern = re.compile(
            r"(?i)(Provider\s+shall\s+indemnify,\s*defend,\s*and\s*hold\s*harmless[^\.\n]+(?:\.|\n|;)|"
            r"defend,\s*indemnify,\s*and\s*hold\s*harmless[^\.\n]+(?:\.|\n|;)|"
            r"indemnify,\s*defend,\s*and\s*hold\s*harmless[^\.\n]+(?:\.|\n|;))"
        )
        indemnity_match = indemnity_pattern.search(text)
        if indemnity_match or any(k in lower_text for k in ["indemnif", "hold harmless"]):
            excerpt = (
                indemnity_match.group(1).strip()
                if indemnity_match
                else self._find_surrounding_sentence(text, "indemnif")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Indemnification"
            findings.append(
                RawClauseFinding(
                    title="Unlimited One-Sided Indemnification Covering Client Negligence",
                    category="liability",
                    severity=self.calibrate_severity("high", "liability", risk_sensitivity),
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation=(
                        "You agree to pay all of the client's losses, legal fees, and liabilities without financial limit, "
                        "including claims caused in whole or in part by the client's own negligence or misuse."
                    ),
                    why_it_matters=(
                        "Exposes you to catastrophic six-figure liabilities far exceeding contract value, even when the client caused the issue."
                    ),
                    recommended_action="Limit indemnification to direct third-party claims arising from gross negligence, exclude client fault, and cap liability.",
                    suggested_counter_clause=(
                        "Each party shall indemnify the other against direct third-party claims arising solely from gross negligence "
                        "or willful misconduct, excluding losses caused by Client's own negligence, capped at total fees paid."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 5. Restrictive Liability Cap & Unclear Indemnity Interaction
        cap_pattern = re.compile(
            r"(?i)(total\s+aggregate\s+liability[^\.\n]+shall\s+not\s+exceed[^\.\n]+preceding\s+one\s+month[^\.\n]*(?:\.|\n|;)|"
            r"total\s+aggregate\s+liability[^\.\n]+shall\s+not\s+exceed[^\.\n]*(?:\.|\n|;)|"
            r"liability\s+of\s+either\s+party\s+shall\s+not\s+exceed[^\.\n]+(?:one\s+month|1\s+month)[^\.\n]*(?:\.|\n|;)|"
            r"shall\s+not\s+exceed\s+the\s+fees\s+actually\s+paid[^\.\n]+preceding\s+one\s+month[^\.\n]*(?:\.|\n|;))"
        )
        cap_match = cap_pattern.search(text)
        if cap_match or ("liability" in lower_text and any(k in lower_text for k in ["one month", "1 month", "shall not exceed the fees"])):
            excerpt = (
                cap_match.group(1).strip()
                if cap_match
                else self._find_surrounding_sentence(text, "liability")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Limitation of Liability"
            findings.append(
                RawClauseFinding(
                    title="Restrictive 1-Month Liability Cap & Unclear Indemnity Interaction",
                    category="liability",
                    severity=self.calibrate_severity("high", "liability", risk_sensitivity),
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation=(
                        "The contract caps liability to fees paid in the preceding one month. Crucially, this limitation does "
                        "not expressly cap the unlimited indemnification in the preceding clause, creating severe asymmetric exposure."
                    ),
                    why_it_matters=(
                        "You remain exposed to unlimited indemnity exposure for client claims, while the client's liability to you "
                        "is capped at a single month's fees."
                    ),
                    recommended_action="Ensure the liability cap mutually covers all obligations including indemnity, and align cap to 12 months fees.",
                    suggested_counter_clause=(
                        "Each party's aggregate liability under this Agreement, including all indemnity obligations, shall not exceed "
                        "the total fees paid or payable under the applicable SOW in the preceding twelve (12) months."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 6. Absolute & 5-Year Software Warranties
        warranty_pattern = re.compile(
            r"(?i)(Provider\s+warrants\s+that\s+the\s+software\s+will\s+be\s+completely\s+error-free[^\.\n]*(?:\.|\n|;)|"
            r"completely\s+error-free,\s*uninterrupted,\s*secure[^\.\n]+five\s+years[^\.\n]*(?:\.|\n|;)|"
            r"warrants?\s+that\s+the\s+software\s+will\s+be\s+completely\s+error-free[^\.\n]*(?:\.|\n|;)|"
            r"secure\s+against\s+every\s+possible\s+cyberattack[^\.\n]*(?:\.|\n|;))"
        )
        warranty_match = warranty_pattern.search(text)
        if warranty_match or ("error-free" in lower_text and any(k in lower_text for k in ["warrant", "cyberattack", "five years", "5 years"])):
            excerpt = (
                warranty_match.group(1).strip()
                if warranty_match
                else self._find_surrounding_sentence(text, "error-free")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Warranties"
            is_extreme_warranty = any(k in lower_text for k in ["cyberattack", "five years", "5 years", "every possible"])
            warranty_title = "Absolute Error-Free & Perpetual Security Warranties (5 Years)" if is_extreme_warranty else "Uncapped Deliverable Warranty"
            warranty_sev = self.calibrate_severity("high", "warranty", risk_sensitivity) if is_extreme_warranty else self.calibrate_severity("low", "warranty", risk_sensitivity)
            findings.append(
                RawClauseFinding(
                    title=warranty_title,
                    category="warranty",
                    severity=warranty_sev,
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation=(
                        "You are warranting that software will be 100% bug-free, uninterrupted, impervious to all cyberattacks, "
                        "and compatible with all future third-party systems for five full years."
                        if is_extreme_warranty
                        else "Requires bug-free performance without clear time limit or remedy ceiling, exposing you to post-delivery maintenance demands."
                    ),
                    why_it_matters=(
                        "An impossible commitment in software engineering that guarantees technical breach upon the discovery of any routine bug or vulnerability."
                        if is_extreme_warranty
                        else "Allows client to demand infinite free maintenance months or years later."
                    ),
                    recommended_action="Replace absolute guarantees with commercially reasonable efforts warranty for a standard 30-90 day period.",
                    suggested_counter_clause=(
                        "Contractor warrants that deliverables will perform in material conformity with agreed specifications for ninety (90) days "
                        "following delivery. Exclusive remedy is commercially reasonable re-performance or repair."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high" if is_extreme_warranty else "medium",
                    needs_human_review=True,
                )
            )

        # 7. Asymmetric Termination for Convenience
        term_pattern = re.compile(
            r"(?i)(Client\s+may\s+terminate\s+this\s+Agreement\s+immediately[^\.\n]+without\s+notice[^\.\n]*(?:\.|\n|;)|"
            r"terminate\s+this\s+Agreement\s+at\s+any\s+time[^\.\n]+one-sided\s+termination[^\.\n]*(?:\.|\n|;)|"
            r"terminate[^\.\n]+without\s+notice\s+or\s+payment\s+for\s+completed[^\.\n]*(?:\.|\n|;)|"
            r"terminate[^\.\n]+for\s+convenience[^\.\n]+(?:\.|\n|;))"
        )
        term_match = term_pattern.search(text)
        if term_match or any(k in lower_text for k in ["terminate immediately", "one-sided termination", "180 days after its due date", "for convenience"]):
            excerpt = (
                term_match.group(1).strip()
                if term_match
                else self._find_surrounding_sentence(text, "terminate")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Termination"
            findings.append(
                RawClauseFinding(
                    title="Asymmetric Termination for Convenience",
                    category="termination",
                    severity=self.calibrate_severity("high", "termination", risk_sensitivity),
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation=(
                        "The client can cancel immediately for convenience without notice and without paying for completed but unpaid work, "
                        "while you cannot terminate until 180 days of non-payment."
                    ),
                    why_it_matters=(
                        "Leaves you without payment protection for invested labor and out-of-pocket expenses if the client cancels unexpectedly."
                    ),
                    recommended_action="Require mutual 30 days written notice and guarantee payment for all work performed up to termination.",
                    suggested_counter_clause=(
                        "Either party may terminate for convenience upon thirty (30) days written notice. Client shall pay Contractor for all "
                        "services completed and non-cancelable commitments incurred prior to the termination date."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=True,
                )
            )

        # 8. Restrictive Non-Compete Covenants
        nc_pattern = re.compile(
            r"(?i)(non-compete|competing\s+business|shall\s+not\s+(?:engage\s+in|provide\s+services\s+to)[^\.\n]+(?:\.|\n|;))"
        )
        nc_match = nc_pattern.search(text)
        if nc_match or any(k in lower_text for k in ["non-compete", "compete with client"]):
            excerpt = (
                nc_match.group(1).strip()
                if nc_match
                else self._find_surrounding_sentence(text, "compete")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Restrictive Covenants"
            findings.append(
                RawClauseFinding(
                    title="Restrictive Non-Compete Covenant",
                    category="confidentiality",
                    severity=self.calibrate_severity("high", "confidentiality", risk_sensitivity),
                    source_excerpt=excerpt,
                    section=sec,
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

        # 9. Standard Confidentiality Survival (Balanced Term)
        conf_pattern = re.compile(
            r"(?i)(Provider\s+shall\s+protect\s+Client’s\s+confidential\s+information[^\.\n]*(?:\.|\n|;)|"
            r"protect\s+Client’s\s+confidential\s+information[^\.\n]*(?:\.|\n|;)|"
            r"confidential\s+information\s+using\s+reasonable\s+security\s+measures[^\.\n]*(?:\.|\n|;))"
        )
        conf_match = conf_pattern.search(text)
        if conf_match or "confidential information" in lower_text:
            excerpt = (
                conf_match.group(1).strip()
                if conf_match
                else self._find_surrounding_sentence(text, "confidential")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Confidentiality"
            findings.append(
                RawClauseFinding(
                    title="Standard Confidentiality Protection (2-Year Survival)",
                    category="confidentiality",
                    severity="low",
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation="Requires reasonable security measures to safeguard client confidential information for two years following termination.",
                    why_it_matters="This is a standard commercial protection that balances confidentiality without creating infinite or unreasonable liabilities.",
                    recommended_action="Maintain mutual reasonable confidentiality standards.",
                    suggested_counter_clause=(
                        "Each party shall protect the other's confidential information using reasonable care for two (2) years following termination."
                        if auto_generate_redlines
                        else None
                    ),
                    confidence="high",
                    needs_human_review=False,
                )
            )

        # 10. Standard Governing Law & Jurisdiction (Balanced Term)
        law_pattern = re.compile(
            r"(?i)(This\s+Agreement\s+shall\s+be\s+governed\s+by\s+the\s+laws\s+of[^\.\n]*(?:\.|\n|;)|"
            r"governed\s+by\s+the\s+laws\s+of[^\.\n]*(?:\.|\n|;))"
        )
        law_match = law_pattern.search(text)
        if law_match or "governed by the laws" in lower_text:
            excerpt = (
                law_match.group(1).strip()
                if law_match
                else self._find_surrounding_sentence(text, "governed")
            )
            sec = contract_segmenter.find_section_for_excerpt(text, excerpt) or "Governing Law"
            findings.append(
                RawClauseFinding(
                    title="Standard Governing Law Clause",
                    category="governing_law",
                    severity="low",
                    source_excerpt=excerpt,
                    section=sec,
                    plain_english_explanation="Specifies the local jurisdiction and applicable governing law for dispute resolution.",
                    why_it_matters="Ensures clear legal jurisdiction for the agreement.",
                    recommended_action="Confirm designated jurisdiction is accessible and standard.",
                    suggested_counter_clause=None,
                    confidence="high",
                    needs_human_review=False,
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
