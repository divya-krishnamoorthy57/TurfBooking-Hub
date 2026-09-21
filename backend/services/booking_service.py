import uuid
from datetime import date, datetime
from typing import List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from backend.models.user import User
from backend.models.turf import Turf
from backend.models.booking import Booking
from backend.schemas.booking import BookingCreate, BookingResponse, BookingCancelResponse
from backend.services.turf_service import STANDARD_SLOTS

def generate_booking_code() -> str:
    """Generate a clean human-readable booking ID like TBH-89412"""
    unique_suffix = uuid.uuid4().hex[:6].upper()
    return f"TBH-{unique_suffix}"

def validate_time_slot(start_time: str, end_time: str) -> bool:
    start_norm = start_time.strip().upper()
    end_norm = end_time.strip().upper()
    for s, e in STANDARD_SLOTS:
        if s.upper() == start_norm and e.upper() == end_norm:
            return True
    return False

def format_booking_response(booking: Booking) -> BookingResponse:
    return BookingResponse(
        id=booking.id,
        booking_code=booking.booking_code,
        user_id=booking.user_id,
        turf_id=booking.turf_id,
        turf_name=booking.turf.name if booking.turf else "Unknown Turf",
        turf_location=booking.turf.location if booking.turf else "Unknown Location",
        turf_image=booking.turf.image if booking.turf else "",
        booking_date=booking.booking_date,
        start_time=booking.start_time,
        end_time=booking.end_time,
        total_amount=float(booking.total_amount),
        status=booking.status,
        created_at=booking.created_at,
        user_name=booking.user.name if booking.user else None,
        user_email=booking.user.email if booking.user else None,
        user_phone=booking.user.phone if booking.user else None
    )

def create_booking(db: Session, user: User, req: BookingCreate) -> BookingResponse:
    # 1. Verify Turf exists
    turf = db.query(Turf).filter(Turf.id == req.turf_id).first()
    if not turf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turf not found")

    # 2. Verify selected date is valid (not in the deep past)
    today = date.today()
    if req.booking_date < today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot book a slot for a past date"
        )

    # 3. Verify selected time slot is valid
    if not validate_time_slot(req.start_time, req.end_time):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid time slot: {req.start_time} - {req.end_time}. Please select a valid slot."
        )

    # 4. Concurrency check: Check whether the same turf is already booked for that date and time
    # We use row lock if supported, plus active booking check
    existing_booking = db.query(Booking).filter(
        Booking.turf_id == req.turf_id,
        Booking.booking_date == req.booking_date,
        Booking.start_time == req.start_time.strip(),
        Booking.status == "CONFIRMED"
    ).with_for_update().first()

    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This slot has already been booked. Please choose another slot."
        )

    # Calculate total amount (1 hour slot * price_per_hour)
    total_amount = float(turf.price_per_hour)
    booking_code = generate_booking_code()

    new_booking = Booking(
        booking_code=booking_code,
        user_id=user.id,
        turf_id=turf.id,
        booking_date=req.booking_date,
        start_time=req.start_time.strip(),
        end_time=req.end_time.strip(),
        total_amount=total_amount,
        status="CONFIRMED"
    )

    try:
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This slot has already been booked. Please choose another slot."
        )

    return format_booking_response(new_booking)

def get_user_bookings(db: Session, user: User) -> List[BookingResponse]:
    bookings = db.query(Booking).options(
        joinedload(Booking.turf),
        joinedload(Booking.user)
    ).filter(
        Booking.user_id == user.id
    ).order_by(Booking.booking_date.desc(), Booking.created_at.desc()).all()

    return [format_booking_response(b) for b in bookings]

def cancel_user_booking(db: Session, user: User, booking_id: int) -> BookingCancelResponse:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    # Check ownership or admin
    if booking.user_id != user.id and user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized to cancel this booking")

    if booking.status == "CANCELLED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Booking is already cancelled")

    booking.status = "CANCELLED"
    db.commit()

    return BookingCancelResponse(
        message="Booking cancelled successfully",
        booking_id=booking.id,
        status="CANCELLED"
    )
