"""
Axiom Database Session and Engine Management
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.app.core.config import settings

from pathlib import Path
from backend.app.core.logging import logger

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DEV_DB_PATH = PROJECT_ROOT / "axiom_dev.db"
DEV_SQLITE_URL = f"sqlite:///{DEV_DB_PATH}"


def init_engine():
    connect_args = {}
    if settings.DATABASE_URL.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    eng = create_engine(
        settings.DATABASE_URL,
        connect_args=connect_args,
        pool_pre_ping=True,
        future=True,
    )

    # In development or test mode, check connectivity and fall back to local SQLite if primary DB is unavailable
    if settings.APP_ENV != "production" and not settings.DATABASE_URL.startswith("sqlite"):
        try:
            with eng.connect() as conn:
                pass
        except Exception as e:
            logger.warning(
                f"Primary database '{settings.DATABASE_URL}' is unreachable: {e}. "
                f"Falling back to local development SQLite database: '{DEV_SQLITE_URL}'"
            )
            eng = create_engine(
                DEV_SQLITE_URL,
                connect_args={"check_same_thread": False},
                pool_pre_ping=True,
                future=True,
            )
            from backend.app.db.base import Base
            import backend.app.models  # ensure models are loaded
            Base.metadata.create_all(bind=eng)

    return eng


engine = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=Session)


def get_db() -> Generator[Session, None, None]:
    """FastAPI request-scoped dependency providing an isolated DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
