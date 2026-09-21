from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.user import User
from backend.schemas.admin import AdminDashboardStats, AdminBookingStatusUpdate
from backend.schemas.turf import TurfCreate, TurfUpdate, TurfResponse
from backend.schemas.booking import BookingResponse
from backend.services.admin_service import (
    get_admin_dashboard_stats,
    create_admin_turf,
    update_admin_turf,
    delete_admin_turf,
    get_all_admin_bookings,
    update_admin_booking_status
)
from backend.services.turf_service import get_turfs
from backend.utils.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"], dependencies=[Depends(require_admin)])

@router.get("/dashboard", response_model=AdminDashboardStats)
def get_dashboard(db: Session = Depends(get_db)):
    return get_admin_dashboard_stats(db=db)

@router.get("/turfs", response_model=List[TurfResponse])
def get_all_turfs(db: Session = Depends(get_db)):
    return get_turfs(db=db)

@router.post("/turfs", response_model=TurfResponse)
def add_turf(req: TurfCreate, db: Session = Depends(get_db)):
    return create_admin_turf(db=db, req=req)

@router.put("/turfs/{turf_id}", response_model=TurfResponse)
def edit_turf(turf_id: int, req: TurfUpdate, db: Session = Depends(get_db)):
    return update_admin_turf(db=db, turf_id=turf_id, req=req)

@router.delete("/turfs/{turf_id}")
def remove_turf(turf_id: int, db: Session = Depends(get_db)):
    return delete_admin_turf(db=db, turf_id=turf_id)

@router.get("/bookings", response_model=List[BookingResponse])
def get_all_bookings(db: Session = Depends(get_db)):
    return get_all_admin_bookings(db=db)

@router.put("/bookings/{booking_id}", response_model=BookingResponse)
def change_booking_status(
    booking_id: int,
    req: AdminBookingStatusUpdate,
    db: Session = Depends(get_db)
):
    return update_admin_booking_status(db=db, booking_id=booking_id, new_status=req.status)
