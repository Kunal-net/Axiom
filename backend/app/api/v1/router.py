"""
Axiom API v1 Central Router
"""

from fastapi import APIRouter

from backend.app.api.v1.routes.auth import router as auth_router
from backend.app.api.v1.routes.documents import router as documents_router
from backend.app.api.v1.routes.health import router as health_router
from backend.app.api.v1.routes.user import router as user_router

api_v1_router = APIRouter()

# Register sub-routers
api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(user_router)
api_v1_router.include_router(documents_router)
