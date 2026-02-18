from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas import match as match_schemas
from app.models import core as models

router = APIRouter()

@router.get("/", response_model=List[match_schemas.MatchWithPrediction])
def read_matches(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve matches with predictions.
    """
    matches = db.query(models.Match).offset(skip).limit(limit).all()
    return matches
