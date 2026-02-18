from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.services.football_data import FootballDataService
from app.services.prediction_service import PredictionService

router = APIRouter()

@router.post("/refresh", status_code=200)
def refresh_data(
    db: Session = Depends(deps.get_db),
):
    """
    Manually trigger a data update cycle:
    1. Fetch new fixtures/odds (mocked as latest live data).
    2. Run ML models on new data.
    3. Update predictions.
    """
    data_svc = FootballDataService(db)
    pred_svc = PredictionService(db)
    
    # 1. Fetch Data
    new_matches = data_svc.fetch_daily_fixtures()
    data_svc.update_odds()
    
    # 2. Run Predictions on new matches
    predictions = pred_svc.run_daily_predictions()
    
    return {
        "status": "success", 
        # Convert objects to simpler dict repr for response if desired, or just count
        "new_matches_count": len(new_matches),
        "predictions_generated": len(predictions),
        "message": f"Added {len(new_matches)} new matches and generated {len(predictions)} predictions."
    }
