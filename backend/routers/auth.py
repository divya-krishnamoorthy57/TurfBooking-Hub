from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database.connection import get_db
from backend.models.user import User
from backend.schemas.auth import UserRegister, UserLogin, UserResponse, UserProfileUpdate, Token
from backend.services.auth_service import register_user, login_user, get_user_profile
from backend.utils.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(req: UserRegister, db: Session = Depends(get_db)):
    return register_user(db, req)

@router.post("/login", response_model=Token)
def login(req: UserLogin, db: Session = Depends(get_db)):
    return login_user(db, req)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_user_profile(db, current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(req: UserProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if req.name is not None:
        current_user.name = req.name.strip()
    if req.phone is not None:
        current_user.phone = req.phone.strip()
    db.commit()
    db.refresh(current_user)
    return get_user_profile(db, current_user)
