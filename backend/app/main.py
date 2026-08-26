import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import db_manager
from .api import cases, entities, network, uploads, alerts, analytics, timeline, auth, audit, notes, health

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("nexus-intel.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Neo4j (or fallback to NetworkX)
    logger.info("Initializing NEXUS INTEL backend services...")
    db_manager.connect()
    
    # Pre-build benchmark graph & run Phase 3 analytics
    try:
        from .api.network import build_network
        await build_network(case_id="CASE-1024", reset=False)
        logger.info("Synthetic benchmark graph & Phase 3 intelligence models initialized.")
    except Exception as e:
        logger.warning(f"Note on initial graph seed: {e}")

    yield

    # Shutdown
    logger.info("Shutting down NEXUS INTEL backend services...")
    db_manager.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Criminal Network Analysis System API (SIH26189 — Ministry of Home Affairs). Synthesizes multi-source investigation records into interactive Knowledge Graphs.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(auth.router)
app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(entities.router, prefix=settings.API_V1_STR)
app.include_router(network.router, prefix=settings.API_V1_STR)
app.include_router(uploads.router, prefix=settings.API_V1_STR)
app.include_router(alerts.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(timeline.router, prefix=settings.API_V1_STR)
app.include_router(audit.router)
app.include_router(notes.router)
app.include_router(health.router)

@app.get("/")
async def root():
    return {
        "system": "NEXUS INTEL",
        "problem_statement": "SIH26189",
        "ministry": "Ministry of Home Affairs",
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "documentation": "/docs"
    }
