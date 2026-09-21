import sys
from pathlib import Path

# Ensure root directory is on sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.database.connection import engine, Base
from backend.database.seed_data import seed
from backend.routers import auth_router, turfs_router, bookings_router, admin_router

# Create FastAPI app
app = FastAPI(
    title="TurfBooking Hub API",
    description="Full-stack turf and sports-ground booking platform API for Coimbatore, Tamil Nadu.",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup hook to initialize and seed database
@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        seed()
    except Exception as e:
        print(f"Warning during startup DB check/seed: {e}")

# Include routers
app.include_router(auth_router)
app.include_router(turfs_router)
app.include_router(bookings_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "app": "TurfBooking Hub API",
        "status": "online",
        "target_city": "Coimbatore, Tamil Nadu, India",
        "docs_url": "/docs"
    }

@app.get("/health")
def health():
    return {"status": "healthy"}
