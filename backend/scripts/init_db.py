import sys
import os

# Add the parent directory (backend) to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import engine, SessionLocal
from app.models.core import Base, League, Team, Match, Odds, Prediction
from datetime import datetime, timedelta

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(League).first():
        print("Data already exists. Skipping seed.")
        db.close()
        return

    print("Seeding initial data...")
    
    # Leagues
    leagues = [
        League(name="Premier League", country="England", is_active=True),
        League(name="La Liga", country="Spain", is_active=True),
        League(name="Serie A", country="Italy", is_active=True),
        League(name="Bundesliga", country="Germany", is_active=True)
    ]
    db.add_all(leagues)
    db.commit()
    
    # Teams (simplified)
    # PL
    pl = leagues[0]
    arsenal = Team(name="Arsenal", league_id=pl.id)
    city = Team(name="Man City", league_id=pl.id)
    liverpool = Team(name="Liverpool", league_id=pl.id)
    chelsea = Team(name="Chelsea", league_id=pl.id)
    
    # La Liga
    ll = leagues[1]
    real = Team(name="Real Madrid", league_id=ll.id)
    barca = Team(name="Barcelona", league_id=ll.id)
    
    teams = [arsenal, city, liverpool, chelsea, real, barca]
    db.add_all(teams)
    db.commit()
    
    # Matches
    today = datetime.now()
    
    matches = [
        Match(
            league_id=pl.id,
            home_team_id=arsenal.id,
            away_team_id=city.id,
            kickoff_time=today + timedelta(hours=2),
            status="SCHEDULED"
        ),
        Match(
            league_id=pl.id,
            home_team_id=liverpool.id,
            away_team_id=chelsea.id,
            kickoff_time=today + timedelta(hours=4),
            status="SCHEDULED"
        ),
        Match(
            league_id=ll.id,
            home_team_id=real.id,
            away_team_id=barca.id,
            kickoff_time=today + timedelta(days=1, hours=19),
            status="SCHEDULED"
        )
    ]
    db.add_all(matches)
    db.commit()
    
    # Odds & Predictions
    for match in matches:
        # Mock Odds
        odds = Odds(
            match_id=match.id,
            bookmaker="Bet365",
            home_win=2.5,
            draw=3.2,
            away_win=2.8,
            implied_home_prob=38.0,
            implied_draw_prob=30.0,
            implied_away_prob=32.0
        )
        db.add(odds)
        
        # Mock Prediction
        pred = Prediction(
            match_id=match.id,
            model_version="v1.0.0",
            home_prob=45.0,
            draw_prob=30.0,
            away_prob=25.0,
            predicted_outcome="HOME",
            edge=7.0,
            risk_level="MEDIUM"
        )
        db.add(pred)
        
    db.commit()
    db.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
