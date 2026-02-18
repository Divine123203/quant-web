from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime
from app.api.api_v1.api import api_router
from app.core.config import settings
from app.db.session import SessionLocal
from app.services.football_data import FootballDataService
from app.services.prediction_service import PredictionService

app = FastAPI(title="QuantBet AI", version="0.1.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

async def auto_refresh_task():
    """Background task to sync data and generate predictions automatically."""
    # Wait 10 seconds after startup before first sync to let server warm up
    await asyncio.sleep(10)
    
    while True:
        try:
            print(f"[{datetime.now()}] Starting automatic background sync...")
            # Run blocking database and network operations in a thread pool
            def do_sync():
                db = SessionLocal()
                try:
                    data_svc = FootballDataService(db)
                    pred_svc = PredictionService(db)
                    data_svc.fetch_daily_fixtures()
                    pred_svc.run_daily_predictions()
                finally:
                    db.close()

            await asyncio.get_event_loop().run_in_executor(None, do_sync)
            print(f"[{datetime.now()}] Background sync complete.")
        except Exception as e:
            print(f"Background Sync Error: {e}")
        
        # Sleep for 6 hours
        await asyncio.sleep(6 * 3600)

@app.on_event("startup")
async def startup_event():
    # Start the automated background task
    asyncio.create_task(auto_refresh_task())

@app.get("/")
def read_root():
    return {"message": "QuantBet AI is running (Auto-Sync Active)"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
