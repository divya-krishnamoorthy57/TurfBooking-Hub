from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.connection import Base

class Sport(Base):
    __tablename__ = "sports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False, index=True)

    turf_sports = relationship("TurfSport", back_populates="sport", cascade="all, delete-orphan")

class TurfSport(Base):
    __tablename__ = "turf_sports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    turf_id = Column(Integer, ForeignKey("turfs.id", ondelete="CASCADE"), nullable=False)
    sport_id = Column(Integer, ForeignKey("sports.id", ondelete="CASCADE"), nullable=False)

    turf = relationship("Turf", back_populates="turf_sports")
    sport = relationship("Sport", back_populates="turf_sports")

class Turf(Base):
    __tablename__ = "turfs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(150), nullable=False, index=True)
    location = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=False)
    price_per_hour = Column(Numeric(10, 2), nullable=False)
    rating = Column(Numeric(2, 1), default=4.5, nullable=False)
    image = Column(String(500), nullable=False)
    facilities = Column(Text, nullable=True)  # Comma-separated or JSON list of facilities
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    turf_sports = relationship("TurfSport", back_populates="turf", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="turf", cascade="all, delete-orphan")
