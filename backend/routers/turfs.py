from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.schemas.turf import TurfResponse, TurfSlotsResponse
from backend.services.turf_service import get_turfs, get_turf_by_id, get_turf_slots

router = APIRouter(prefix="/turfs", tags=["Turfs"])

@router.get("", response_model=List[TurfResponse])
def list_turfs(
    location: Optional[str] = Query(None, description="Filter by location (e.g. Coimbatore, Saravanampatti)"),
    sport: Optional[str] = Query(None, description="Filter by sport name"),
    min_price: Optional[float] = Query(None, description="Minimum price per hour"),
    max_price: Optional[float] = Query(None, description="Maximum price per hour"),
    min_rating: Optional[float] = Query(None, description="Minimum rating"),
    sort_by: Optional[str] = Query(None, description="Sort option: price_asc, price_desc, rating_desc"),
    db: Session = Depends(get_db)
):
    return get_turfs(
        db=db,
        location=location,
        sport=sport,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        sort_by=sort_by
    )

@router.get("/{turf_id}", response_model=TurfResponse)
def get_turf(turf_id: int, db: Session = Depends(get_db)):
    return get_turf_by_id(db, turf_id)

@router.get("/{turf_id}/slots", response_model=TurfSlotsResponse)
def get_slots(
    turf_id: int,
    date: date = Query(..., description="Date to check slot availability (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    return get_turf_slots(db=db, turf_id=turf_id, query_date=date)
