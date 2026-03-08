from sqlalchemy.orm import Session
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import RegisterRequest


def authenticate_user(db: Session, *, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_user(db: Session, user_in: RegisterRequest) -> User:
    db_obj = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_active=True,
        is_superuser=False,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# AuthService class - services/__init__.py ke liye
class AuthService:
    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> User | None:
        return authenticate_user(db, email=email, password=password)

    @staticmethod
    def register(db: Session, user_in: RegisterRequest) -> User:
        return create_user(db, user_in)