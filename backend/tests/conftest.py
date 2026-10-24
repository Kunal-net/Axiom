"""
Axiom Backend Test Configuration and Fixtures
"""

import io
import os
import shutil
import tempfile
from typing import Generator
import pytest
from fastapi.testclient import TestClient
from pypdf import PdfWriter
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

# Force test configuration
os.environ["APP_ENV"] = "test"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key-for-axiom-32charslong!"
os.environ["MAX_UPLOAD_SIZE_MB"] = "5"

from backend.app.core.config import settings
from backend.app.core.security import create_access_token, hash_password
from backend.app.db.base import Base
from backend.app.db.session import get_db
from backend.app.main import app
from backend.app.models.user import User
from backend.app.services.storage_service import LocalDocumentStorage, storage_service

# Setup in-memory test SQLite engine
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    temp_dir = tempfile.mkdtemp(prefix="axiom_test_uploads_")
    storage_service.base_dir = temp_dir
    settings.UPLOAD_DIR = temp_dir

    yield

    shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def user_a(db_session: Session) -> User:
    user = User(
        id="usr-test-a",
        email="user_a@example.com",
        password_hash=hash_password("Password123!"),
        name="Alice User",
        role="Product Designer",
        organization="Studio Alice",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def user_b(db_session: Session) -> User:
    user = User(
        id="usr-test-b",
        email="user_b@example.com",
        password_hash=hash_password("Password123!"),
        name="Bob User",
        role="Creative Director",
        organization="Studio Bob",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def auth_headers_a(user_a: User) -> dict:
    token = create_access_token({"sub": user_a.id, "email": user_a.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_headers_b(user_b: User) -> dict:
    token = create_access_token({"sub": user_b.id, "email": user_b.email})
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_pdf_bytes() -> bytes:
    writer = PdfWriter()
    writer.add_blank_page(width=612, height=792)
    stream = io.BytesIO()
    writer.write(stream)
    return stream.getvalue()
