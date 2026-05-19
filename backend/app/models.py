import enum
from datetime import datetime, date
from sqlalchemy import (
    Integer, String, DateTime, Date, Text,
    ForeignKey, CheckConstraint, UniqueConstraint, Enum as SAEnum, func, text
)
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

# Статусы
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PARTICIPANT = "participant"

class TournamentStatus(str, enum.Enum):
    RECRUITING = "recruiting"
    IN_PROGRESS = "in_progress"
    FINISHED = "finished"

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class ResultStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"

class FinalStatus(str, enum.Enum):
    FINISHED = "finished"
    DISQUALIFIED = "disqualified"

# Роли и пользователи
class Role(Base):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[UserRole] = mapped_column(SAEnum(UserRole), unique=True)

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    login: Mapped[str] = mapped_column(String(50), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role_id: Mapped[int] = mapped_column(ForeignKey("roles.id"))

# Участники
class Participant(Base):
    __tablename__ = "participants"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    game_nickname: Mapped[str] = mapped_column(String(50))
    town_hall_level: Mapped[int] = mapped_column()
    registered_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    status: Mapped[str] = mapped_column(String(20), server_default="active")

# Турниры
class Tournament(Base):
    __tablename__ = "tournaments"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    status: Mapped[TournamentStatus] = mapped_column(
        SAEnum(TournamentStatus), 
        server_default="recruiting"
    )

# Этапы
class Stage(Base):
    __tablename__ = "stages"
    __table_args__ = (
        UniqueConstraint("tournament_id", "stage_number", name="uq_stage_number"),
        CheckConstraint("stage_number BETWEEN 1 AND 3", name="chk_stage_1_to_3"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    tournament_id: Mapped[int] = mapped_column(ForeignKey("tournaments.id"))
    stage_number: Mapped[int] = mapped_column()
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    min_stars: Mapped[int] = mapped_column(server_default=text("0"))          
    min_destruction: Mapped[int] = mapped_column(server_default=text("0"))    

# Заявки
class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("tournament_id", "participant_id", name="uq_one_app_per_tournament"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    tournament_id: Mapped[int] = mapped_column(ForeignKey("tournaments.id"))
    participant_id: Mapped[int] = mapped_column(ForeignKey("participants.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    status: Mapped[ApplicationStatus] = mapped_column(
        SAEnum(ApplicationStatus), 
        server_default="pending"
    )
    admin_comment: Mapped[str | None] = mapped_column(Text, nullable=True)

# Результаты атак
class AttackResult(Base):
    __tablename__ = "attack_results"
    __table_args__ = (
        CheckConstraint("stars BETWEEN 0 AND 3", name="chk_stars_0_3"),
        CheckConstraint("destruction BETWEEN 0 AND 100", name="chk_destruction_0_100"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    stage_id: Mapped[int] = mapped_column(ForeignKey("stages.id"))
    participant_id: Mapped[int] = mapped_column(ForeignKey("participants.id"))
    army_composition: Mapped[str] = mapped_column(Text)
    stars: Mapped[int] = mapped_column()
    destruction: Mapped[int] = mapped_column()
    attack_time: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    screenshot_path: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[ResultStatus] = mapped_column(
        SAEnum(ResultStatus), 
        server_default="pending"
    )
    admin_comment: Mapped[str | None] = mapped_column(Text, nullable=True)

# Итоги турнира
class TournamentResult(Base):
    __tablename__ = "tournament_results"
    __table_args__ = (
        UniqueConstraint("tournament_id", "participant_id", name="uq_final_result"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    tournament_id: Mapped[int] = mapped_column(ForeignKey("tournaments.id"))
    participant_id: Mapped[int] = mapped_column(ForeignKey("participants.id"))
    total_stars: Mapped[int] = mapped_column(server_default=text("0"))         
    total_destruction: Mapped[int] = mapped_column(server_default=text("0"))   
    final_place: Mapped[int | None] = mapped_column(nullable=True)
    status: Mapped[FinalStatus] = mapped_column(
        SAEnum(FinalStatus), 
        server_default="finished"
    )