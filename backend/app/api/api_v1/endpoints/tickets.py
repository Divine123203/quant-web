from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.api import deps
from app.models.core import Match, Prediction, SavedTicket
from app.schemas import match as match_schemas

router = APIRouter()

class TicketRequest(BaseModel):
    gameCount: int
    riskLevel: str
    marketType: str

class TicketResponse(BaseModel):
    matches: List[match_schemas.MatchWithPrediction]
    totalOdds: float
    expectedReturn: float

class SaveTicketRequest(BaseModel):
    total_odds: float
    potential_return: float
    matches: List[dict] # Simplified match info for JSON storage

@router.post("/generate", response_model=TicketResponse)
def generate_ticket(
    req: TicketRequest,
    db: Session = Depends(deps.get_db),
):
    """
    Generate an optimized ticket based on user criteria.
    """
    import random
    
    # 1. Base query: Scheduled matches with AI predictions
    base_query = db.query(Match).join(Prediction).filter(Match.status == "SCHEDULED")
    
    # 2. Risk Level Filtering
    risk_map = {
        "Low": ["LOW"],
        "Medium": ["LOW", "MEDIUM"],
        "Aggressive": ["LOW", "MEDIUM", "HIGH"]
    }
    allowed_risks = risk_map.get(req.riskLevel, ["LOW", "MEDIUM", "HIGH"])
    base_query = base_query.filter(Prediction.risk_level.in_(allowed_risks))
    
    # 3. Market Type Filtering (Primary Filter)
    primary_query = base_query
    if "Home Wins" in req.marketType:
        primary_query = primary_query.filter(Prediction.predicted_outcome == "HOME")
    elif "Away Wins" in req.marketType:
        primary_query = primary_query.filter(Prediction.predicted_outcome == "AWAY")
    elif "Draws" in req.marketType:
        primary_query = primary_query.filter(Prediction.predicted_outcome == "DRAW")
    elif "Double Chance" in req.marketType:
        primary_query = primary_query.filter(Prediction.predicted_outcome.in_(["HOME", "DRAW"]))
    
    # Fetch primary candidates
    # We want a pool large enough for variety, but focused on high edge
    primary_matches = primary_query.order_by(Prediction.edge.desc()).limit(req.gameCount * 5).all()
    
    # 4. Fill-up Logic: If we don't have enough primary matches, grab from other markets
    final_selection = []
    if len(primary_matches) >= req.gameCount:
        final_selection = random.sample(primary_matches, req.gameCount)
    else:
        # Take all primary matches
        final_selection = primary_matches
        # Fill the rest with high-edge matches from the general base pool (excluding those already picked)
        exclude_ids = [m.id for m in final_selection]
        needed = req.gameCount - len(final_selection)
        
        fallback_matches = base_query.filter(Match.id.notin_(exclude_ids))\
                                    .order_by(Prediction.edge.desc())\
                                    .limit(needed * 2).all()
        
        if fallback_matches:
            final_selection.extend(random.sample(fallback_matches, min(needed, len(fallback_matches))))

    # 5. Final fallback if DB is very empty
    if len(final_selection) < req.gameCount:
        extra_needed = req.gameCount - len(final_selection)
        exclude_ids = [m.id for m in final_selection]
        pure_fallback = db.query(Match).filter(Match.status == "SCHEDULED", Match.id.notin_(exclude_ids))\
                                      .limit(extra_needed).all()
        final_selection.extend(pure_fallback)

    # 6. Calculate Stats
    total_odds = 1.0
    for m in final_selection:
        # Default fallback odds
        m_odds = 1.8 
        if m.odds:
            # If the user specifically asked for Double Chance, calculate DC odds
            if "Double Chance" in req.marketType:
                h_inv = 1/m.odds.home_win if m.odds.home_win > 0 else 0.5
                d_inv = 1/m.odds.draw if m.odds.draw > 0 else 0.3
                m_odds = round(1 / (h_inv + d_inv), 2)
            # Otherwise use the predicted outcome's odds
            elif m.prediction:
                if m.prediction.predicted_outcome == 'HOME':
                    m_odds = m.odds.home_win
                elif m.prediction.predicted_outcome == 'AWAY':
                    m_odds = m.odds.away_win
                else: # DRAW
                    m_odds = m.odds.draw
            # If no prediction but we found the match, use home odds as a generic pick
            else:
                m_odds = m.odds.home_win
        
        total_odds *= m_odds
            
    return {
        "matches": final_selection,
        "totalOdds": round(total_odds, 2),
        "expectedReturn": round(total_odds * 10, 2)
    }

@router.post("/save")
def save_ticket(
    req: SaveTicketRequest,
    db: Session = Depends(deps.get_db)
):
    """Save a generated ticket to history."""
    ticket = SavedTicket(
        total_odds=req.total_odds,
        potential_return=req.potential_return,
        matches_json=req.matches
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {"status": "success", "id": ticket.id}

@router.get("/history")
def get_ticket_history(
    limit: int = 20,
    db: Session = Depends(deps.get_db)
):
    """Retrieve saved ticket history."""
    tickets = db.query(SavedTicket).order_by(SavedTicket.created_at.desc()).limit(limit).all()
    return tickets
