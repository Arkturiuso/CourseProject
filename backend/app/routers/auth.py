from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.database import get_db
from app.models import User, Role, UserRole
from app.schemas import UserRegister, UserLogin, Token, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.execute(select(User).where(User.login == data.login)).scalar_one_or_none():
        raise HTTPException(400, "Логин уже занят")
    
    role = db.execute(select(Role).where(Role.name == UserRole.PARTICIPANT)).scalar_one_or_none()
    if not role:
        raise HTTPException(500, "Роль 'participant' не найдена в БД. Запусти сид данных.")
        
    new_user = User(
        login=data.login,
        password_hash=get_password_hash(data.password),
        role_id=role.id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.login == credentials.login)).scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": create_access_token({"sub": user.login}), "token_type": "bearer"}