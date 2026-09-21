from backend.routers.auth import router as auth_router
from backend.routers.turfs import router as turfs_router
from backend.routers.bookings import router as bookings_router
from backend.routers.admin import router as admin_router

__all__ = ["auth_router", "turfs_router", "bookings_router", "admin_router"]
