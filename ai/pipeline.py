"""
Axiom Contract Analysis Pipeline (Member 3 Central Pipeline)
Coordinates document input validation, segmentation, prompt dispatch,
LLM provider execution, evidence validation, and fallback handling.
"""

from typing import List, Optional
from pydantic import BaseModel

from ai.comparator import contract_comparator
from ai.config import AISettings, ai_settings
from ai.exceptions import AIError
from ai.prompts import SYSTEM_ANALYSIS_PROMPT, build_analysis_user_prompt
from ai.providers.base import BaseLLMProvider
from ai.providers.factory import get_llm_provider
from ai.schemas import RawAnalysisResponse, RawClauseFinding
from ai.scorer import risk_scorer
from ai.segmenter import contract_segmenter
from ai.validator import evidence_validator
from backend.app.core.logging import logger
from backend.app.schemas.analysis import RiskCountsSchema
from backend.app.schemas.clause import ClauseFindingSchema
from backend.app.schemas.compare import DocumentDiffSchema


class AnalysisOutput(BaseModel):
    summary: str
    risk_counts: RiskCountsSchema
    clauses: List[ClauseFindingSchema]
    provider: str
    model_name: str


class ContractAnalysisPipeline:
    """Production-grade AI Contract Intelligence Pipeline."""

    def __init__(
        self,
        provider: Optional[BaseLLMProvider] = None,
        settings: Optional[AISettings] = None,
        model: Optional[str] = None,
    ):
        self.settings = settings or ai_settings
        if provider:
            self.provider = provider
        else:
            self.provider = get_llm_provider(
                model_name=model or self.settings.AI_MODEL,
                settings=self.settings,
            )

    def analyze(
        self,
        text: str,
        filename: str,
        risk_sensitivity: str = "standard",
        explanation_style: str = "plain_english",
        auto_generate_redlines: bool = True,
    ) -> AnalysisOutput:
        """Runs end-to-end evidence-grounded contract risk analysis."""
        logger.info(
            f"[Axiom AI] Initiating analysis for '{filename}' "
            f"(provider={self.provider.model_name}, sensitivity={risk_sensitivity}, length={len(text)} chars)"
        )

        # 1. Detect empty, scanned, or garbled input
        input_status = contract_segmenter.detect_input_status(text)
        if not input_status.is_valid:
            logger.warning(f"[Axiom AI] Input document flagged: status={input_status.status}, message={input_status.message}")
            info_clause = ClauseFindingSchema(
                id="clause-1",
                title=f"Document Text Layer Notice: {input_status.status.capitalize()}",
                severity="info",
                section="Document Extraction Status",
                pageNumber=1,
                originalText=text[:200].strip() if text.strip() else "[No embedded text found in document]",
                explanation=input_status.message,
                whyRisky="Without a digital text layer, automated clause extraction cannot ground specific risk findings.",
                suggestedRevision="Re-upload an original digital PDF or run Optical Character Recognition (OCR) first.",
                category="governing_law",
                reviewed=False,
                bookmarked=False,
            )
            return AnalysisOutput(
                summary=input_status.message,
                risk_counts=RiskCountsSchema(high=0, medium=0, low=0, info=1),
                clauses=[info_clause],
                provider="axiom-segmenter",
                model_name="extraction-guard",
            )

        # 2. Normalize text and parse layout
        normalized_text = contract_segmenter.normalize_text(text)
        validated_clauses: List[ClauseFindingSchema] = []
        summary_text: Optional[str] = None
        executed_provider = "rule_benchmark"
        executed_model = "commercial-benchmark-rules"

        # 3. Attempt LLM Analysis if provider credentials exist
        has_credentials = getattr(self.provider, "api_key", None) is not None
        is_mock_provider = getattr(self.provider, "model_name", "") == "mock-pipeline-model"

        if has_credentials or is_mock_provider:
            try:
                # Use bounded context (up to 12,000 chars for prompt)
                chunk_to_analyze = normalized_text[: self.settings.AI_MAX_CHUNK_CHARS]
                user_prompt = build_analysis_user_prompt(
                    contract_text=chunk_to_analyze,
                    filename=filename,
                    risk_sensitivity=risk_sensitivity,
                    explanation_style=explanation_style,
                    auto_generate_redlines=auto_generate_redlines,
                )

                raw_response = self.provider.generate(
                    system_prompt=SYSTEM_ANALYSIS_PROMPT,
                    user_prompt=user_prompt,
                    response_schema=RawAnalysisResponse,
                )

                parsed_json = self.provider.parse_json_response(raw_response)
                raw_findings_data = parsed_json.get("findings", [])
                raw_findings = [RawClauseFinding(**f) for f in raw_findings_data]

                # Calibrate categories and severities
                for rf in raw_findings:
                    rf.category = risk_scorer.normalize_category(rf.category)
                    rf.severity = risk_scorer.calibrate_severity(rf.severity, rf.category, risk_sensitivity)

                # Ground findings in actual source text
                grounded = evidence_validator.validate_and_ground_findings(
                    raw_findings=raw_findings,
                    source_text=normalized_text,
                    auto_generate_redlines=auto_generate_redlines,
                )

                if grounded:
                    validated_clauses = grounded
                    summary_text = parsed_json.get("summary")
                    executed_provider = getattr(self.provider, "provider_name", "llm-provider")
                    executed_model = self.provider.model_name
                    logger.info(f"[Axiom AI] Successfully analyzed {len(validated_clauses)} grounded clauses via LLM")

            except Exception as e:
                # Fallback on LLM failure, timeout, auth error, or schema error
                logger.warning(
                    f"[Axiom AI] LLM execution encountered issue ({type(e).__name__}: {e}). "
                    "Falling back to deterministic contract benchmark engine."
                )

        # 4. Fallback: Run deterministic benchmark rules if LLM produced no validated clauses
        if not validated_clauses:
            logger.info("[Axiom AI] Applying deterministic contract intelligence benchmark rules")
            rule_findings = risk_scorer.run_benchmark_rules(
                text=normalized_text,
                risk_sensitivity=risk_sensitivity,
                explanation_style=explanation_style,
                auto_generate_redlines=auto_generate_redlines,
            )
            validated_clauses = evidence_validator.validate_and_ground_findings(
                raw_findings=rule_findings,
                source_text=normalized_text,
                auto_generate_redlines=auto_generate_redlines,
            )

        # 5. If still no clauses found, provide standard fallback benchmark set
        if not validated_clauses:
            validated_clauses = [
                ClauseFindingSchema(
                    id="clause-1",
                    title="Standard Commercial Contract Review",
                    severity="info",
                    section="General Provisions",
                    pageNumber=1,
                    originalText=normalized_text[:120].strip() if normalized_text else "General terms.",
                    explanation="No immediate high-severity deviations from standard commercial benchmarks were flagged.",
                    whyRisky="Standard contracting terms apply; consider standard verification of payment and IP boundaries.",
                    suggestedRevision="Maintain standard 30-day payment and bilateral indemnification terms.",
                    category="liability",
                    reviewed=False,
                    bookmarked=False,
                )
            ]

        # 6. Calculate risk counts
        high_count = sum(1 for c in validated_clauses if c.severity == "high")
        med_count = sum(1 for c in validated_clauses if c.severity == "medium")
        low_count = sum(1 for c in validated_clauses if c.severity == "low")
        info_count = sum(1 for c in validated_clauses if c.severity == "info")

        risk_counts = RiskCountsSchema(
            high=high_count,
            medium=med_count,
            low=low_count,
            info=info_count,
        )

        # 7. Formulate summary if not already provided
        if not summary_text:
            if high_count > 0:
                summary_text = (
                    f"The contract contains {high_count} significant commercial risks for independent practitioners: "
                    "unlimited indemnification obligations without liability caps, broad intellectual property forfeiture, "
                    "and unfavorable commercial terms. Counter-proposals are recommended before signing."
                )
            elif med_count > 0:
                summary_text = (
                    f"The contract presents moderate risks ({med_count} items flagged), primarily related to payment schedules "
                    "and termination notice periods. Standard commercial redlines are advised."
                )
            else:
                summary_text = "The contract aligns well with standard commercial contracting benchmarks for independent professionals."

        return AnalysisOutput(
            summary=summary_text,
            risk_counts=risk_counts,
            clauses=validated_clauses,
            provider=executed_provider,
            model_name=executed_model,
        )

    def compare_documents(
        self,
        original_title: str,
        original_text: str,
        revised_title: str,
        revised_text: str,
    ) -> List[DocumentDiffSchema]:
        """Synthesizes structured side-by-side legal diffs between two contract versions."""
        return contract_comparator.compare(
            original_title=original_title,
            original_text=original_text,
            revised_title=revised_title,
            revised_text=revised_text,
            provider=self.provider,
        )
