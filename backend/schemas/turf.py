from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, Field

class SportSchema(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class SlotInfo(BaseModel):
    start_time: str
    end_time: str
    is_available: bool
    is_past: bool = False

class TurfBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    location: str = Field(..., min_length=2, max_length=150)
    description: str
    price_per_hour: float = Field(..., gt=0)
    rating: float = Field(default=4.5, ge=1.0, le=5.0)
    image: str = Field(..., min_length=5)
    facilities: Optional[str] = "Parking, Flood Lights, Drinking Water, Washroom"

class TurfCreate(TurfBase):
    sports: List[str] = Field(..., min_length=1)

class TurfUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    price_per_hour: Optional[float] = None
    rating: Optional[float] = None
    image: Optional[str] = None
    facilities: Optional[str] = None
    sports: Optional[List[str]] = None

class TurfResponse(TurfBase):
    id: int
    sports: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TurfSlotsResponse(BaseModel):
    turf_id: int
    turf_name: str
    date: date
    slots: List[SlotInfo]
