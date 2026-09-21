from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date, ForeignKey, Computed, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.database.connection import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_code = Column(String(30), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    turf_id = Column(Integer, ForeignKey("turfs.id", ondelete="RESTRICT"), nullable=False)
    booking_date = Column(Date, nullable=False, index=True)
    start_time = Column(String(20), nullable=False)  # e.g., "06:00 AM"
    end_time = Column(String(20), nullable=False)    # e.g., "07:00 AM"
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="CONFIRMED", nullable=False, index=True)  # CONFIRMED, CANCELLED, COMPLETED
    
    # Generated column for unique active slot enforcement
    active_slot_key = Column(
        String(120),
        Computed(
            "CASE WHEN status = 'CONFIRMED' THEN CONCAT(turf_id, '_', booking_date, '_', start_time) ELSE NULL END",
            persisted=True
        ),
        unique=True,
        nullable=True
    )
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="bookings")
    turf = relationship("Turf", back_populates="bookings")
