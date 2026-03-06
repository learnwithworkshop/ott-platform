from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import logging

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.init_db import init_db
from app.db.session import engine
from app.db.base import Base
from app.db.utils import DatabaseManager

logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Secure OTT Streaming Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.ENVIRONMENT != "production" else None,
    docs_url="/api/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/api/redoc" if settings.ENVIRONMENT != "production" else None,
)

# Startup event - Initialize database
@app.on_event("startup")
async def startup_event():
    """Initialize database on application startup."""
    logger.info("Starting OTT Platform API...")
    try:
        init_db()
        logger.info("✓ Database initialized successfully")
        
        # Check database health
        health = DatabaseManager.health_check()
        if health["status"] == "healthy":
            logger.info(f"✓ Database health check passed: {health['message']}")
        else:
            logger.warning(f"✗ Database health check failed: {health['message']}")
    except Exception as e:
        logger.error(f"✗ Startup error: {str(e)}")
        raise

# Shutdown event - Cleanup
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    logger.info("Shutting down OTT Platform API...")
    try:
        engine.dispose()
        logger.info("✓ Database connections disposed")
    except Exception as e:
        logger.error(f"✗ Shutdown error: {str(e)}")

# Security Middleware Stack - Order matters!
# 1. Trusted Host (prevent Host Header Attacks)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
    www_redirect=True,
)

# 2. HTTPS Redirect (in production)
if settings.ENVIRONMENT == "production":
    app.add_middleware(HTTPSRedirectMiddleware)

# 3. GZIP Compression
app.add_middleware(GZIPMiddleware, minimum_size=1000)

# 4. CORS (most restrictive)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,
    expose_headers=["Content-Length", "Content-Range"],
)

# Custom exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler - prevents info leakage"""
    detail = exc.detail
    if settings.ENVIRONMENT == "production" and exc.status_code >= 500:
        detail = "Internal server error. Please contact support."
    
    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder({"detail": detail, "type": "http_exception"}),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """Custom validation exception handler"""
    if settings.ENVIRONMENT == "production":
        return JSONResponse(
            status_code=422,
            content=jsonable_encoder({"detail": "Invalid request parameters"}),
        )
    return JSONResponse(
        status_code=422,
        content=jsonable_encoder({"detail": exc.errors()}),
    )

# Health check endpoints
@app.get("/health", tags=["System"])
def health_check():
    """Application health check endpoint"""
    return {"status": "healthy", "service": "OTT Platform API"}


@app.get("/health/db", tags=["System"])
def database_health():
    """Database health check endpoint"""
    return DatabaseManager.health_check()


@app.get("/metrics", tags=["System"])
def metrics():
    """Metrics endpoint (basic information)"""
    return {
        "status": "running",
        "database": DatabaseManager.get_connection_info(),
    }


# Include routers with prefix
app.include_router(api_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        access_log=True,
    )