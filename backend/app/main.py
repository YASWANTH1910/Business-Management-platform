from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logger import log_info, log_error
from app.routes import auth, contacts, bookings, inventory, alerts, messages, dashboard

# Create FastAPI application
app = FastAPI(
    title="CareOps API",
    description="Production-ready backend for unified business operations platform",
    version="1.0.0",
    docs_url="/docs" if not settings.is_production else None,  # Disable docs in production
    redoc_url="/redoc" if not settings.is_production else None
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    
    Returns structured JSON response and logs the error.
    """
    log_error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Internal server error",
            "error_code": "INTERNAL_ERROR",
            "detail": str(exc) if not settings.is_production else "An error occurred"
        }
    )


# Health Check Endpoint
@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }


# Startup Event
@app.on_event("startup")
async def startup_event():
    """
    Application startup event.
    
    Initialize database tables in development.
    In production, use Alembic migrations instead.
    """
    log_info(f"[STARTUP] Starting CareOps API in {settings.ENVIRONMENT} mode")
    
    if not settings.is_production:
        log_info("[STARTUP] Initializing database tables (development mode)")
        from app.core.database import init_db
        init_db()
    
    log_info("[STARTUP] Application started successfully")


# Shutdown Event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown event."""
    log_info("[SHUTDOWN] Shutting down CareOps API")


# Register Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(contacts.router)
app.include_router(bookings.router)
app.include_router(inventory.router)
app.include_router(alerts.router)
app.include_router(messages.router)

from app.routes import conversations
app.include_router(conversations.router)


# Root Endpoint
@app.get("/", tags=["Root"])
def root():
    """Root endpoint with API information."""
    return {
        "message": "CareOps API",
        "version": "1.0.0",
        "docs": "/docs" if not settings.is_production else "disabled",
        "health": "/health"
    }
