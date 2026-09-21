from datetime import date, datetime
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from backend.models.turf import Turf, Sport, TurfSport
from backend.models.booking import Booking
from backend.schemas.turf import TurfResponse, TurfSlotsResponse, SlotInfo

STANDARD_SLOTS = [
    ("6:00 AM", "7:00 AM"),
    ("7:00 AM", "8:00 AM"),
    ("8:00 AM", "9:00 AM"),
    ("9:00 AM", "10:00 AM"),
    ("5:00 PM", "6:00 PM"),
    ("6:00 PM", "7:00 PM"),
    ("7:00 PM", "8:00 PM"),
    ("8:00 PM", "9:00 PM"),
    ("9:00 PM", "10:00 PM"),
]

def format_turf_response(turf: Turf) -> TurfResponse:
    sports_list = [ts.sport.name for ts in turf.turf_sports if ts.sport]
    return TurfResponse(
        id=turf.id,
        name=turf.name,
        location=turf.location,
        description=turf.description,
        price_per_hour=float(turf.price_per_hour),
        rating=float(turf.rating),
        image=turf.image,
        facilities=turf.facilities,
        sports=sports_list,
        created_at=turf.created_at
    )

def get_turfs(
    db: Session,
    location: Optional[str] = None,
    sport: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None,
    sort_by: Optional[str] = None
) -> List[TurfResponse]:
    query = db.query(Turf).options(joinedload(Turf.turf_sports).joinedload(TurfSport.sport))

    if location and location.strip():
        query = query.filter(Turf.location.ilike(f"%{location.strip()}%"))

    if sport and sport.strip() and sport.lower() != "all":
        query = query.join(Turf.turf_sports).join(TurfSport.sport).filter(
            Sport.name.ilike(f"%{sport.strip()}%")
        )

    if min_price is not None:
        query = query.filter(Turf.price_per_hour >= min_price)

    if max_price is not None:
        query = query.filter(Turf.price_per_hour <= max_price)

    if min_rating is not None:
        query = query.filter(Turf.rating >= min_rating)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Turf.price_per_hour.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Turf.price_per_hour.desc())
    elif sort_by == "rating_desc":
        query = query.order_by(Turf.rating.desc())
    else:
        query = query.order_by(Turf.id.asc())

    turfs = query.all()
    # Deduplicate in case joined query produced duplicate rows
    seen = set()
    result = []
    for t in turfs:
        if t.id not in seen:
            seen.add(t.id)
            result.append(format_turf_response(t))
    return result

def get_turf_by_id(db: Session, turf_id: int) -> TurfResponse:
    turf = db.query(Turf).options(
        joinedload(Turf.turf_sports).joinedload(TurfSport.sport)
    ).filter(Turf.id == turf_id).first()

    if not turf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turf not found")

    return format_turf_response(turf)

def get_turf_slots(db: Session, turf_id: int, query_date: date) -> TurfSlotsResponse:
    turf = db.query(Turf).filter(Turf.id == turf_id).first()
    if not turf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Turf not found")

    # Get active bookings for the specified date and turf
    active_bookings = db.query(Booking).filter(
        Booking.turf_id == turf_id,
        Booking.booking_date == query_date,
        Booking.status == "CONFIRMED"
    ).all()

    booked_slots = {b.start_time.strip().upper(): b for b in active_bookings}

    slot_list: List[SlotInfo] = []
    for start, end in STANDARD_SLOTS:
        # Check if booked
        is_booked = start.strip().upper() in booked_slots
        slot_list.append(SlotInfo(
            start_time=start,
            end_time=end,
            is_available=not is_booked,
            is_past=False
        ))

    return TurfSlotsResponse(
        turf_id=turf.id,
        turf_name=turf.name,
        date=query_date,
        slots=slot_list
    )
