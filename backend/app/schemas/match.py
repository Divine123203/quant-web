from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

class PredictionBase(BaseModel):
    home_prob: float
    draw_prob: float
    away_prob: float
    predicted_outcome: str
    edge: float
    risk_level: str

class Prediction(PredictionBase):
    id: int
    match_id: int
    
    class Config:
        from_attributes = True

class MatchBase(BaseModel):
    league: str
    kickoff_time: datetime

class Match(MatchBase):
    id: int
    status: str
    home_team: str 
    away_team: str

    @field_validator('home_team', 'away_team', 'league', mode='before')
    @classmethod
    def extract_name(cls, v):
        if hasattr(v, 'name'):
            return v.name
        return str(v)

    class Config:
        from_attributes = True

class Odds(BaseModel):
    home_win: float
    draw: float
    away_win: float

    class Config:
        from_attributes = True

class MatchWithPrediction(Match):
    prediction: Optional[Prediction] = None
    odds: Optional[Odds] = None
