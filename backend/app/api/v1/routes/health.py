"""
Axiom Health and Readiness Routes
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.app.db.session import get_db

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Service Liveness and Readiness Probe")
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    from ai.config import ai_settings
    ai_status = "active" if ai_settings.has_api_key else "benchmark_rules"
    ai_provider = ai_settings.get_provider_name()

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": db_status,
        "ai": {
            "status": ai_status,
            "provider": ai_provider,
            "model": ai_settings.AI_MODEL,
        },
    }
