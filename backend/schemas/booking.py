from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field

class BookingCreate(BaseModel):
    turf_id: int
    booking_date: date
    start_time: str = Field(..., description="e.g., '6:00 AM' or '06:00 AM'")
    end_time: str = Field(..., description="e.g., '7:00 AM' or '07:00 AM'")

class BookingResponse(BaseModel):
    id: int
    booking_code: str
    user_id: int
    turf_id: int
    turf_name: str
    turf_location: str
    turf_image: str
    booking_date: date
    start_time: str
    end_time: str
    total_amount: float
    status: str
    created_at: datetime
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    user_phone: Optional[str] = None

    class Config:
        from_attributes = True

class BookingCancelResponse(BaseModel):
    message: str
    booking_id: int
    status: str
