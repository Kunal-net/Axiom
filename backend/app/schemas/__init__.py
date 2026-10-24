"""
Axiom Schemas Package
"""

from backend.app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    UserSafeResponse,
    TokenResponse,
)
from backend.app.schemas.user import UserProfileSchema, UserProfileUpdateSchema
from backend.app.schemas.clause import (
    ClauseFindingSchema,
    ClausePatchRequest,
    ClausePatchResponse,
)
from backend.app.schemas.analysis import (
    RiskCountsSchema,
    AnalysisInitiateRequest,
    AnalysisResponse,
)
from backend.app.schemas.document import (
    ContractDocumentResponse,
    DocumentListResponse,
)
from backend.app.schemas.compare import (
    DocumentComparisonRequest,
    DocumentComparisonResponse,
    DocumentDiffSchema,
)

__all__ = [
    "RegisterRequest",
    "LoginRequest",
    "UserSafeResponse",
    "TokenResponse",
    "UserProfileSchema",
    "UserProfileUpdateSchema",
    "ClauseFindingSchema",
    "ClausePatchRequest",
    "ClausePatchResponse",
    "RiskCountsSchema",
    "AnalysisInitiateRequest",
    "AnalysisResponse",
    "ContractDocumentResponse",
    "DocumentListResponse",
    "DocumentComparisonRequest",
    "DocumentComparisonResponse",
    "DocumentDiffSchema",
]
