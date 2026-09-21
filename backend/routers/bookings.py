from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.user import User
from backend.schemas.booking import BookingCreate, BookingResponse, BookingCancelResponse
from backend.services.booking_service import create_booking, get_user_bookings, cancel_user_booking
from backend.utils.dependencies import get_current_user

router = APIRouter(prefix="/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse)
def book_slot(
    req: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_booking(db=db, user=current_user, req=req)

@router.get("/my", response_model=List[BookingResponse])
def my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_bookings(db=db, user=current_user)

@router.put("/{booking_id}/cancel", response_model=BookingCancelResponse)
def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return cancel_user_booking(db=db, user=current_user, booking_id=booking_id)
