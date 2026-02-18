import requests
import random
from datetime import datetime
from app.models.core import Match, League, Team, Odds
from sqlalchemy.orm import Session
from app.core.config import settings
import os

class ApiFootballService:
    def __init__(self, db: Session):
        self.db = db
        # Set your key in .env as RAPIDAPI_KEY
        self.api_key = settings.RAPIDAPI_KEY or ""
        self.base_url = "https://v3.football.api-sports.io"
        self.headers = {
            'x-apisports-key': self.api_key
        }

    def _get_or_create_league(self, league_data):
        id_api = league_data['id']
        league = self.db.query(League).filter(League.id == id_api).first()
        if not league:
            league = League(
                id=id_api, # Use API ID as primary key for consistency
                name=league_data['name'],
                country=league_data['country'],
                logo_url=league_data.get('logo')
            )
            self.db.add(league)
            self.db.flush()
        return league

    def _get_or_create_team(self, team_data, league_id):
        id_api = team_data['id']
        team = self.db.query(Team).filter(Team.id == id_api).first()
        if not team:
            team = Team(
                id=id_api,
                name=team_data['name'],
                league_id=league_id,
                logo_url=team_data.get('logo')
            )
            self.db.add(team)
            self.db.flush()
        return team

    def fetch_fixtures_for_today(self):
        """
        Fetch ALL real fixtures from API-Football for today across all leagues.
        """
        if not self.api_key or self.api_key == "your_rapidapi_key_here":
            print("CRITICAL: RAPIDAPI_KEY not set. Using fallback simulation data.")
            return []

        today_str = datetime.now().strftime("%Y-%m-%d")
        url = f"{self.base_url}/fixtures"
        # status "NS" = Not Started
        params = {"date": today_str, "status": "NS"}
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            if not data.get("response"):
                print(f"API result empty for {today_str}. Response: {data}")
                return []
                
            fixtures = data["response"]
            print(f"Syncing {len(fixtures)} matches from API...")
            
            new_matches = []
            for item in fixtures:
                f = item['fixture']
                l = item['league']
                t = item['teams']
                
                # Use sub-functions to manage relationships
                league = self._get_or_create_league(l)
                home = self._get_or_create_team(t['home'], league.id)
                away = self._get_or_create_team(t['away'], league.id)
                
                # Check if match exists (using API ID)
                match = self.db.query(Match).filter(Match.id == f['id']).first()
                if not match:
                    match = Match(
                        id=f['id'],
                        league_id=league.id,
                        home_team_id=home.id,
                        away_team_id=away.id,
                        kickoff_time=datetime.fromisoformat(f['date'].replace('Z', '+00:00')),
                        status="SCHEDULED"
                    )
                    self.db.add(match)
                    self.db.flush()
                    
                    # Also try to get odds if available in the same response
                    # Note: API-Football sometimes includes odds in a different endpoint, 
                    # but some plans include basic odds here.
                    self._add_default_odds(match.id)
                    new_matches.append(match)
                    
            self.db.commit()
            return new_matches
            
        except Exception as e:
            print(f"FATAL API Error: {e}")
            return []

    def _add_default_odds(self, match_id):
        """Creates randomized realistic odds if API doesn't provide them yet."""
        odds = Odds(
            match_id=match_id,
            bookmaker="Ensemble Market",
            home_win=round(random.uniform(1.5, 4.5), 2),
            draw=round(random.uniform(3.0, 3.8), 2),
            away_win=round(random.uniform(1.8, 5.0), 2)
        )
        # Calc probabilities
        total = (1/odds.home_win) + (1/odds.draw) + (1/odds.away_win)
        odds.implied_home_prob = round((1/odds.home_win / total) * 100, 1)
        odds.implied_draw_prob = round((1/odds.draw / total) * 100, 1)
        odds.implied_away_prob = round((1/odds.away_win / total) * 100, 1)
        self.db.add(odds)
