import sys
import os

# Add the 'backend' directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from app.db.session import SessionLocal
from app.models.core import Match, Prediction

def check_db():
    db = SessionLocal()
    try:
        matches = db.query(Match).all()
        print(f"Total Matches in DB: {len(matches)}")
        for m in matches:
            # Check for relationships
            h_name = m.home_team.name if m.home_team else "Unknown"
            a_name = m.away_team.name if m.away_team else "Unknown"
            print(f"Match: {m.id} - {h_name} vs {a_name} - Status: {m.status}")
            if m.prediction:
                print(f"  Prediction: {m.prediction.predicted_outcome} - Edge: {m.prediction.edge}")
            else:
                print("  No Prediction")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
