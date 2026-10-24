# Axiom Backend — Developer & Setup Guide (Member 2)

> Production-minded FastAPI + PostgreSQL backend for Axiom Contract Intelligence Platform.
> Fully compliant with `Axiom_Member_2_Backend_Master_Prompt.pdf` specifications.

---

## 1. System Requirements

- **Python:** 3.11+ (verified up to Python 3.14.7)
- **Database:** PostgreSQL 15+ (PostgreSQL 16 recommended)
- **Node.js:** 18+ (for frontend client)

---

## 2. Directory Structure

```text
backend/
├── app/
│   ├── main.py                  # FastAPI application bootstrap, CORS & middleware
│   ├── core/
│   │   ├── config.py            # Typed Pydantic BaseSettings & environment validation
│   │   ├── security.py          # Argon2id password hashing & JWT token management
│   │   ├── errors.py            # Standardized API error envelopes & exception handlers
│   │   └── logging.py           # Structured logging with request tracing & secret redaction
│   ├── db/
│   │   ├── base.py              # DeclarativeBase & UTC TimestampMixin
│   │   └── session.py           # Engine & request-scoped session dependency
│   ├── models/                  # SQLAlchemy ORM models (User, Document, Analysis, ClauseFinding)
│   ├── schemas/                 # Pydantic v2 request/response schemas
│   ├── api/
│   │   ├── deps.py              # get_current_user & database injection
│   │   └── v1/
│   │       ├── router.py        # Central API v1 router
│   │       └── routes/          # health, auth, user, documents endpoints
│   └── services/
│       ├── storage_service.py   # Private storage with path traversal defenses
│       ├── extraction_service.py# PyMuPDF/pypdf/docx text extraction
│       ├── analysis_service.py  # AI & benchmark contract intelligence engine
│       └── document_service.py  # Document lifecycle coordinator
├── migrations/                  # Alembic migration revisions
├── tests/                       # Complete pytest suite (21 unit & integration tests)
├── requirements.txt             # Locked dependencies
├── alembic.ini                  # Migration settings
└── README.md                    # This document
```

---

## 3. Quickstart & Local Setup

### Step 1: Create and Activate Virtual Environment
```bash
# From repository root:
python3 -m venv backend/.venv
source backend/.venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### Step 3: Configure Environment Variables
Copy template to `.env`:
```bash
cp .env.example .env
```
Ensure your database connection string is configured in `.env`:
```ini
DATABASE_URL=postgresql+psycopg://axiom_user:axiom_password@localhost:5432/axiom_db
```

### Step 4: Start PostgreSQL (Docker)
If you don't have a local PostgreSQL instance running:
```bash
docker run -d --name axiom-postgres -p 5432:5432 \
  -e POSTGRES_USER=axiom_user \
  -e POSTGRES_PASSWORD=axiom_password \
  -e POSTGRES_DB=axiom_db \
  postgres:16-alpine
```

### Step 5: Run Database Migrations
Initialize database schema from zero:
```bash
PYTHONPATH=. ./backend/.venv/bin/alembic -c backend/alembic.ini upgrade head
```

### Step 6: Start the Development Server
```bash
PYTHONPATH=. ./backend/.venv/bin/uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Base URL: `http://localhost:8000/api/v1`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/v1/health`

---

## 4. Running Tests

Run the complete backend test suite:
```bash
PYTHONPATH=. ./backend/.venv/bin/pytest backend/tests -v
```

The test suite includes:
- **`test_health.py`**: Health probe & root information.
- **`test_auth.py`**: User registration, login, token verification, and profile management.
- **`test_documents.py`**: PDF/DOCX upload, empty/oversized/unsupported file rejection, listing, pagination, and deletion.
- **`test_analysis.py`**: Full analysis workflow, risk scoring, clause tagging, structured output persistence, and re-analysis versioning.
- **`test_isolation.py`**: Cross-user ownership enforcement (verifying user isolation across reads, writes, analyses, and deletes).
- **`test_compare.py`**: Side-by-side legal diff synthesis.
- **`test_postgres_integration.py`**: Live PostgreSQL connection and schema validation.
- **`test_storage_security.py`**: Path traversal defense (`../` attack rejection) and safe key generation.

---

## 5. Security & Privacy Guarantees

1. **Ownership Isolation:** Every document and analysis endpoint strictly enforces user ownership. Resource IDs cannot be guessed to access another tenant's documents (returns `404 Not Found`).
2. **Path Traversal Protection:** All storage keys are strictly validated and generated as opaque hashes; user-supplied filenames are never used as filesystem paths.
3. **Zero Secret Leakage:** Global error handlers intercept all unhandled exceptions and return safe, standardized JSON error envelopes with request IDs, never revealing SQL queries, internal paths, or stack traces.
4. **Credential Safety:** Passwords are hashed using Argon2id with automatic salt generation; plain passwords are never stored.
5. **No Secret Commits:** Local upload directories (`.local_uploads/`), SQLite files (`*.db`), and virtual environments are ignored in `.gitignore`.
