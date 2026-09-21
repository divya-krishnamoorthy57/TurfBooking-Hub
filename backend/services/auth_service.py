from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.models.user import User
from backend.models.booking import Booking
from backend.schemas.auth import UserRegister, UserLogin, UserResponse
from backend.utils.security import hash_password, verify_password, create_access_token

def register_user(db: Session, req: UserRegister) -> dict:
    existing_user = db.query(User).filter(User.email == req.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )
    
    new_user = User(
        name=req.name.strip(),
        email=req.email.lower().strip(),
        phone=req.phone.strip(),
        password_hash=hash_password(req.password),
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    
    user_resp = UserResponse(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        phone=new_user.phone,
        role=new_user.role,
        created_at=new_user.created_at,
        total_bookings=0
    )
    return {"access_token": token, "token_type": "bearer", "user": user_resp}

def login_user(db: Session, req: UserLogin) -> dict:
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    total_bookings = db.query(Booking).filter(Booking.user_id == user.id).count()

    token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role})
    user_resp = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        created_at=user.created_at,
        total_bookings=total_bookings
    )
    return {"access_token": token, "token_type": "bearer", "user": user_resp}

def get_user_profile(db: Session, user: User) -> UserResponse:
    total_bookings = db.query(Booking).filter(Booking.user_id == user.id).count()
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        created_at=user.created_at,
        total_bookings=total_bookings
    )
