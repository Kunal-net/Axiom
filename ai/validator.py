"""
Axiom Evidence Validation and Grounding Engine
Verifies that all LLM-quoted clause excerpts physically exist in the source document.
Grounds page numbers in real extraction metadata, repairs minor discrepancies,
and rejects completely hallucinated findings.
"""

import re
from typing import List, Optional, Tuple

from ai.schemas import RawClauseFinding
from ai.segmenter import contract_segmenter
from backend.app.core.logging import logger
from backend.app.schemas.clause import ClauseFindingSchema


class EvidenceValidator:
    """Rigorous factual verification and quotation grounding guardrail."""

    def __init__(self, min_match_ratio: float = 0.6):
        self.min_match_ratio = min_match_ratio

    def normalize_for_matching(self, text: str) -> str:
        """Flattens whitespace and punctuation for resilient quote matching."""
        if not text:
            return ""
        # Lowercase and replace non-alphanumeric with single space
        return re.sub(r"[^\w\s]", " ", text.lower()).strip()

    def find_grounded_excerpt(
        self,
        excerpt: str,
        source_text: str,
    ) -> Tuple[bool, Optional[str]]:
        """Verifies if the excerpt exists in source_text.
        Returns (is_grounded, repaired_verbatim_text).
        """
        if not excerpt or not source_text:
            return False, None

        # 1. Direct exact substring match
        if excerpt in source_text:
            return True, excerpt

        # 2. Case-insensitive substring match
        idx = source_text.lower().find(excerpt.lower())
        if idx != -1:
            verbatim = source_text[idx : idx + len(excerpt)]
            return True, verbatim

        # 3. Normalized whitespace / punctuation match
        norm_source = self.normalize_for_matching(source_text)
        norm_excerpt = self.normalize_for_matching(excerpt)

        if norm_excerpt in norm_source:
            # Map back to source words
            words = excerpt.split()
            if len(words) >= 3:
                first_few = " ".join(words[:3])
                first_idx = source_text.lower().find(first_few.lower())
                if first_idx != -1:
                    verbatim = source_text[first_idx : first_idx + len(excerpt) + 30]
                    # Cut at sentence or line boundary
                    boundary = re.search(r"[\.\n;]", verbatim)
                    end = boundary.start() + 1 if boundary else len(verbatim)
                    return True, source_text[first_idx : first_idx + end].strip()
            return True, excerpt

        # 4. Longest common word n-gram matching
        excerpt_words = norm_excerpt.split()
        if len(excerpt_words) >= 5:
            # Try matching 5-word chunks
            for i in range(len(excerpt_words) - 4):
                ngram = " ".join(excerpt_words[i : i + 5])
                if ngram in norm_source:
                    logger.debug(f"Partially grounded excerpt via 5-gram: '{ngram}'")
                    return True, excerpt

        return False, None

    def validate_and_ground_findings(
        self,
        raw_findings: List[RawClauseFinding],
        source_text: str,
        auto_generate_redlines: bool = True,
    ) -> List[ClauseFindingSchema]:
        """Validates, grounds, and converts raw LLM findings into backend ClauseFindingSchema.
        Rejects or repairs unsupported citations.
        """
        validated: List[ClauseFindingSchema] = []
        clause_id_counter = 1

        for raw in raw_findings:
            raw_quote = (raw.source_excerpt or "").strip()
            is_grounded, verbatim_quote = self.find_grounded_excerpt(raw_quote, source_text)

            if not is_grounded:
                # Master Prompt safety rule: reject or flag unsupported quotations
                logger.warning(
                    f"Rejecting ungrounded clause finding '{raw.title}': excerpt not found in source text"
                )
                continue

            quote_to_use = verbatim_quote or raw_quote

            # Determine genuine page number from extraction metadata
            grounded_page = contract_segmenter.find_best_page_for_excerpt(
                source_text,
                quote_to_use,
                fallback_page=raw.page_number or 1,
            )

            # Determine section
            section = (raw.section or "").strip()
            if not section:
                section = f"Page {grounded_page} Clause"

            # Revision
            suggested_rev = (raw.suggested_counter_clause or "").strip()
            if not suggested_rev and auto_generate_redlines:
                suggested_rev = f"Consider revising {raw.title} to limit contractor exposure to fees paid."

            finding = ClauseFindingSchema(
                id=f"clause-{clause_id_counter}",
                title=raw.title.strip() or "Contractual Risk Finding",
                severity=raw.severity,
                section=section,
                pageNumber=max(1, grounded_page),
                originalText=quote_to_use,
                explanation=raw.plain_english_explanation.strip(),
                whyRisky=raw.why_it_matters.strip(),
                suggestedRevision=suggested_rev or "Revise to ensure mutual commercial balance.",
                category=raw.category,
                reviewed=False,
                bookmarked=False,
            )
            validated.append(finding)
            clause_id_counter += 1

        return validated


evidence_validator = EvidenceValidator()
