import sys
from pathlib import Path
from datetime import date, timedelta

# Ensure project root is in sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.database.connection import SessionLocal, Base, engine
from backend.models.user import User
from backend.models.turf import Turf, Sport, TurfSport
from backend.models.booking import Booking
from backend.utils.security import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Sports
        sports_data = ["Football", "Cricket", "Badminton", "Basketball"]
        sport_map = {}

        for s_name in sports_data:
            sport = db.query(Sport).filter(Sport.name == s_name).first()

            if not sport:
                sport = Sport(name=s_name)
                db.add(sport)
                db.flush()

            sport_map[s_name] = sport

        # 2. Seed Users

        # Admin
        admin = db.query(User).filter(
            User.email == "admin@turfbooking.com"
        ).first()

        if not admin:
            admin = User(
                name="Admin Manager",
                email="admin@turfbooking.com",
                phone="9876543210",
                password_hash=hash_password("Admin@123456"),
                role="admin"
            )
            db.add(admin)
            print("Admin account created: admin@turfbooking.com / Admin@123456")

        # Demo User
        demo_user = db.query(User).filter(
            User.email == "karthik@gmail.com"
        ).first()

        if not demo_user:
            demo_user = User(
                name="Karthik Raj",
                email="karthik@gmail.com",
                phone="9845012345",
                password_hash=hash_password("User@123456"),
                role="user"
            )
            db.add(demo_user)
            print("Demo user created: karthik@gmail.com / User@123456")

        db.flush()

        # 3. Seed Realistic Coimbatore Turfs
        turfs_data = [
            {
                "name": "Coimbatore Sports Arena",
                "location": "Saravanampatti, Coimbatore",
                "description": "Premier multi-sport turf facility located in Saravanampatti featuring FIFA-standard artificial grass, high-power floodlights for night matches, and comfortable dugouts.",
                "price_per_hour": 800.0,
                "rating": 4.8,
                "image": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
                "facilities": "Parking, Changing Room, Drinking Water, Flood Lights, Washroom, Seating Area",
                "sports": ["Football", "Cricket"]
            },
            {
                "name": "GreenField Turf",
                "location": "Peelamedu, Coimbatore",
                "description": "Spacious football turf arena with top-tier shock-absorption turf technology, ideal for 5-a-side and 7-a-side matches in the heart of Peelamedu.",
                "price_per_hour": 700.0,
                "rating": 4.6,
                "image": "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=1200&q=80",
                "facilities": "Flood Lights, Drinking Water, Washroom, Parking",
                "sports": ["Football"]
            },
            {
                "name": "ProKick Football Arena",
                "location": "RS Puram, Coimbatore",
                "description": "Centrally located in RS Puram, ProKick features tournament-grade monofilament grass, professional LED floodlighting, shower rooms, and café lounge.",
                "price_per_hour": 900.0,
                "rating": 4.9,
                "image": "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80",
                "facilities": "Flood Lights, Changing Room, Washroom, Seating Area, Parking, Drinking Water",
                "sports": ["Football"]
            },
            {
                "name": "SmashZone Badminton",
                "location": "Saibaba Colony, Coimbatore",
                "description": "International BWF-standard synthetic & wooden badminton courts with anti-glare lighting and climate-control ventilation in Saibaba Colony.",
                "price_per_hour": 500.0,
                "rating": 4.7,
                "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
                "facilities": "Wooden Courts, Changing Room, Washroom, Drinking Water, Seating Area, Parking",
                "sports": ["Badminton"]
            },
            {
                "name": "Champions Turf",
                "location": "Vadavalli, Coimbatore",
                "description": "Versatile cricket pitch and football turf nestled near the Marudhamalai foothills in Vadavalli. Perfect for weekend corporate leagues and box cricket.",
                "price_per_hour": 850.0,
                "rating": 4.8,
                "image": "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80",
                "facilities": "Flood Lights, Parking, Washroom, Drinking Water, Dugouts, Equipment Rental",
                "sports": ["Cricket", "Football"]
            },
            {
                "name": "Apex Hoop & Turf",
                "location": "Gandhipuram, Coimbatore",
                "description": "Modern multi-court setup offering all-weather basketball hardcourt and 5-a-side artificial football turf, right next to Gandhipuram central hub.",
                "price_per_hour": 800.0,
                "rating": 4.7,
                "image": "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
                "facilities": "Flood Lights, Parking, Washroom, Drinking Water, Seating Area",
                "sports": ["Basketball", "Football"]
            }
        ]

        # Create new turfs and update images for existing turfs
        for t_info in turfs_data:

            existing_turf = db.query(Turf).filter(
                Turf.name == t_info["name"]
            ).first()

            if existing_turf:
                # Update only the image for existing turf
                existing_turf.image = t_info["image"]

                print(f"Updated image: {existing_turf.name}")

            else:
                turf = Turf(
                    name=t_info["name"],
                    location=t_info["location"],
                    description=t_info["description"],
                    price_per_hour=t_info["price_per_hour"],
                    rating=t_info["rating"],
                    image=t_info["image"],
                    facilities=t_info["facilities"]
                )

                db.add(turf)
                db.flush()

                for sp_name in t_info["sports"]:
                    sp = sport_map.get(sp_name)

                    if sp:
                        db.add(
                            TurfSport(
                                turf_id=turf.id,
                                sport_id=sp.id
                            )
                        )

                print(f"Created turf: {turf.name}")

        # 4. Create sample upcoming and past booking for demo user
        first_turf = db.query(Turf).first()

        if demo_user and first_turf:

            existing_sample_booking = db.query(Booking).filter(
                Booking.user_id == demo_user.id
            ).first()

            if not existing_sample_booking:

                # Upcoming booking for tomorrow
                tomorrow = date.today() + timedelta(days=1)

                b1 = Booking(
                    booking_code="TBH-DEMO-01",
                    user_id=demo_user.id,
                    turf_id=first_turf.id,
                    booking_date=tomorrow,
                    start_time="6:00 PM",
                    end_time="7:00 PM",
                    total_amount=float(first_turf.price_per_hour),
                    status="CONFIRMED"
                )

                db.add(b1)

                # Past booking
                yesterday = date.today() - timedelta(days=2)

                b2 = Booking(
                    booking_code="TBH-PAST-02",
                    user_id=demo_user.id,
                    turf_id=first_turf.id,
                    booking_date=yesterday,
                    start_time="7:00 AM",
                    end_time="8:00 AM",
                    total_amount=float(first_turf.price_per_hour),
                    status="COMPLETED"
                )

                db.add(b2)

                print("Created sample bookings for demo user")

        db.commit()

        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()