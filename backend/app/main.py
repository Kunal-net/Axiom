"""
Axiom Backend Main Application Entrypoint
FastAPI application bootstrap, lifespan, middleware, and router registration.
"""

from contextlib import asynccontextmanager
import time
import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from backend.app.api.deps import get_or_create_demo_user
from backend.app.api.v1.router import api_v1_router
from backend.app.core.config import settings
from backend.app.core.errors import register_exception_handlers
from backend.app.core.logging import configure_logging, logger, request_id_ctx
from backend.app.db.session import SessionLocal


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Startup actions
    configure_logging(settings.LOG_LEVEL)
    logger.info(f"Starting {settings.APP_NAME} in [{settings.APP_ENV}] mode")
    logger.info(f"CORS origins configured: {settings.CORS_ORIGINS}")

    # Seed demo user in development/test mode
    if not settings.is_production:
        try:
            db = SessionLocal()
            try:
                get_or_create_demo_user(db)
                logger.info("Verified local demo user (Alex Mercer)")
            finally:
                db.close()
        except Exception as e:
            logger.warning(f"Could not seed demo user at startup (database might need migration): {e}")

    yield

    # Shutdown actions
    logger.info(f"Shutting down {settings.APP_NAME}")


class RequestTracingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        req_id = request.headers.get("X-Request-ID") or f"req-{uuid.uuid4().hex[:12]}"
        token = request_id_ctx.set(req_id)
        start_time = time.time()
        try:
            response = await call_next(request)
            duration_ms = (time.time() - start_time) * 1000
            response.headers["X-Request-ID"] = req_id
            response.headers["X-Response-Time"] = f"{duration_ms:.2f}ms"
            return response
        finally:
            request_id_ctx.reset(token)


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Axiom Contract Intelligence REST API — Powered by Member 2 Backend",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# 1. Tracing & Request ID Middleware
app.add_middleware(RequestTracingMiddleware)

# 2. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-Response-Time"],
)

# 3. Global Standardized Exception Handlers
register_exception_handlers(app)

# 4. Include API Routers
app.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "api": settings.API_V1_PREFIX,
    }
