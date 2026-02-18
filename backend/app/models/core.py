from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class League(Base):
    __tablename__ = "leagues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    country = Column(String, index=True)
    logo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    teams = relationship("Team", back_populates="league")
    matches = relationship("Match", back_populates="league")

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"))
    logo_url = Column(String, nullable=True)
    
    league = relationship("League", back_populates="teams")
    home_matches = relationship("Match", foreign_keys="Match.home_team_id", back_populates="home_team")
    away_matches = relationship("Match", foreign_keys="Match.away_team_id", back_populates="away_team")

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    league_id = Column(Integer, ForeignKey("leagues.id"))
    home_team_id = Column(Integer, ForeignKey("teams.id"))
    away_team_id = Column(Integer, ForeignKey("teams.id"))
    kickoff_time = Column(DateTime(timezone=True), index=True)
    status = Column(String, default="SCHEDULED")  # SCHEDULED, LIVE, FINISHED
    
    home_score = Column(Integer, nullable=True)
    away_score = Column(Integer, nullable=True)
    
    league = relationship("League", back_populates="matches")
    home_team = relationship("Team", foreign_keys=[home_team_id], back_populates="home_matches")
    away_team = relationship("Team", foreign_keys=[away_team_id], back_populates="away_matches")
    
    odds = relationship("Odds", back_populates="match", uselist=False)
    prediction = relationship("Prediction", back_populates="match", uselist=False)

class Odds(Base):
    __tablename__ = "odds"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    bookmaker = Column(String)
    
    home_win = Column(Float)
    draw = Column(Float)
    away_win = Column(Float)
    
    implied_home_prob = Column(Float)
    implied_draw_prob = Column(Float)
    implied_away_prob = Column(Float)
    
    match = relationship("Match", back_populates="odds")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    model_version = Column(String)
    
    home_prob = Column(Float)
    draw_prob = Column(Float)
    away_prob = Column(Float)
    
    predicted_outcome = Column(String)  # HOME, DRAW, AWAY
    edge = Column(Float)
    risk_level = Column(String)  # LOW, MEDIUM, HIGH
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    match = relationship("Match", back_populates="prediction")

class SavedTicket(Base):
    __tablename__ = "saved_tickets"

    id = Column(Integer, primary_key=True, index=True)
    total_odds = Column(Float)
    potential_return = Column(Float)
    stake = Column(Float, default=10.0)
    matches_json = Column(JSON) # Stores list of matches with their predicted outcomes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user = relationship("User", back_populates="saved_tickets")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    saved_tickets = relationship("SavedTicket", back_populates="user")

