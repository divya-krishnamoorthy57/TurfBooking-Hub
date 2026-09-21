from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status
from backend.models.user import User
from backend.models.turf import Turf, Sport, TurfSport
from backend.models.booking import Booking
from backend.schemas.admin import AdminDashboardStats
from backend.schemas.turf import TurfCreate, TurfUpdate, TurfResponse
from backend.schemas.booking import BookingResponse
from backend.services.turf_service import format_turf_response
from backend.services.booking_service import format_booking_response

def get_admin_dashboard_stats(db: Session) -> AdminDashboardStats:
    total_users = db.query(User).filter(User.role == "user").count()
    total_turfs = db.query(Turf).count()
    total_bookings = db.query(Booking).count()
    
    confirmed_bookings = db.query(Booking).filter(Booking.status == "CONFIRMED").count()
    cancelled_bookings = db.query(Booking).filter(Booking.status == "CANCELLED").count()

    revenue_query = db.query(func.sum(Booking.total_amount)).filter(
        Booking.status.in_(["CONFIRMED", "COMPLETED"])
    ).scalar()
    
    total_revenue = float(revenue_query or 0.0)

    return AdminDashboardStats(
        total_users=total_users,
        total_turfs=total_turfs,
        total_bookings=total_bookings,
        total_revenue=total_revenue,
        confirmed_bookings=confirmed_bookings,
        cancelled_bookings=cancelled_bookings
    )

def create_admin_turf(db: Session, req: TurfCreate) -> TurfResponse:
    facilities_str = req.facilities if isinstance(req.facilities, str) else ", ".join(req.facilities or [])
    
    new_turf = Turf(
        name=req.name.strip(),
        location=req.location.strip(),
        description=req.description.strip(),
        price_per_hour=req.price_per_hour,
        rating=req.rating,
        image=req.image.strip(),
        facilities=facilities_str
    )
    db.add(new_turf)
    db.flush()

    # Add sports
    for sport_name in req.sports:
        sport_clean = sport_name.strip()
        sport = db.query(Sport).filter(Sport.name.ilike(sport_clean)).first()
        if not sport:
            sport = Sport(name=sport_clean)
            db.add(sport)
            db.flush()
        turf_sport = TurfSport(turf_id=new_turf.id, sport_id=sport.id)
        db.add(turf_sport)

    db.commit()
    db.refresh(new_turf)
    return format_turf_response(new_turf)

def update_admin_turf(db: Session, turf_id: int, req: TurfUpdate) -> TurfResponse:
    turf = db.query(Turf).filter(Turf.id == turf_id).first()
    if not turf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turf not found")

    if req.name is not None:
        turf.name = req.name.strip()
    if req.location is not None:
        turf.location = req.location.strip()
    if req.description is not None:
        turf.description = req.description.strip()
    if req.price_per_hour is not None:
        turf.price_per_hour = req.price_per_hour
    if req.rating is not None:
        turf.rating = req.rating
    if req.image is not None:
        turf.image = req.image.strip()
    if req.facilities is not None:
        turf.facilities = req.facilities

    if req.sports is not None:
        # Clear existing turf_sports
        db.query(TurfSport).filter(TurfSport.turf_id == turf.id).delete()
        for sport_name in req.sports:
            sport_clean = sport_name.strip()
            sport = db.query(Sport).filter(Sport.name.ilike(sport_clean)).first()
            if not sport:
                sport = Sport(name=sport_clean)
                db.add(sport)
                db.flush()
            turf_sport = TurfSport(turf_id=turf.id, sport_id=sport.id)
            db.add(turf_sport)

    db.commit()
    db.refresh(turf)
    return format_turf_response(turf)

def delete_admin_turf(db: Session, turf_id: int) -> dict:
    turf = db.query(Turf).filter(Turf.id == turf_id).first()
    if not turf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turf not found")

    db.delete(turf)
    db.commit()
    return {"message": "Turf deleted successfully", "turf_id": turf_id}

def get_all_admin_bookings(db: Session) -> List[BookingResponse]:
    bookings = db.query(Booking).options(
        joinedload(Booking.turf),
        joinedload(Booking.user)
    ).order_by(Booking.booking_date.desc(), Booking.created_at.desc()).all()

    return [format_booking_response(b) for b in bookings]

def update_admin_booking_status(db: Session, booking_id: int, new_status: str) -> BookingResponse:
    booking = db.query(Booking).options(
        joinedload(Booking.turf),
        joinedload(Booking.user)
    ).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    valid_statuses = ["CONFIRMED", "CANCELLED", "COMPLETED"]
    clean_status = new_status.strip().upper()
    if clean_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{new_status}'. Allowed: {', '.join(valid_statuses)}"
        )

    booking.status = clean_status
    db.commit()
    db.refresh(booking)
    return format_booking_response(booking)
