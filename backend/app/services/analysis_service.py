"""
Axiom AI & Heuristic Contract Analysis Engine
Provides structured clause segmentation, risk categorization, plain-English synthesis,
and balanced redline counter-proposals.
"""

import re
from typing import List, Optional, Tuple
from pydantic import BaseModel

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.schemas.analysis import RiskCountsSchema
from backend.app.schemas.clause import ClauseFindingSchema, RiskSeverity
from backend.app.schemas.compare import DocumentDiffSchema


class AnalysisOutput(BaseModel):
    summary: str
    risk_counts: RiskCountsSchema
    clauses: List[ClauseFindingSchema]
    provider: str
    model_name: str


from ai.pipeline import ContractAnalysisPipeline


class ContractAnalysisEngine:
    """
    Production-grade contract intelligence engine.
    Delegates to Member 3's AI pipeline (ai/pipeline.py), providing evidence-grounded
    LLM reasoning, strict schema validation, page grounding, and benchmark fallback.
    """

    def __init__(self):
        self.pipeline = ContractAnalysisPipeline()

    def analyze(
        self,
        text: str,
        filename: str,
        risk_sensitivity: str = "standard",
        explanation_style: str = "plain_english",
        auto_generate_redlines: bool = True,
    ) -> AnalysisOutput:
        return self.pipeline.analyze(
            text=text,
            filename=filename,
            risk_sensitivity=risk_sensitivity,
            explanation_style=explanation_style,
            auto_generate_redlines=auto_generate_redlines,
        )

    def compare_documents(
        self,
        original_title: str,
        original_text: str,
        revised_title: str,
        revised_text: str,
    ) -> List[DocumentDiffSchema]:
        """Synthesizes structured side-by-side legal diffs between two contract versions."""
        return self.pipeline.compare_documents(
            original_title=original_title,
            original_text=original_text,
            revised_title=revised_title,
            revised_text=revised_text,
        )


analysis_service = ContractAnalysisEngine()

