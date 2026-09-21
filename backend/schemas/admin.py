from typing import List, Optional
from pydantic import BaseModel
from backend.schemas.turf import TurfResponse
from backend.schemas.booking import BookingResponse

class AdminDashboardStats(BaseModel):
    total_users: int
    total_turfs: int
    total_bookings: int
    total_revenue: float
    confirmed_bookings: int
    cancelled_bookings: int

class AdminBookingStatusUpdate(BaseModel):
    status: str  # CONFIRMED, CANCELLED, COMPLETED
