import random
from datetime import datetime, timedelta
from app.models.core import Match, League, Team, Odds, Prediction
from sqlalchemy.orm import Session
from app.services.api_football import ApiFootballService

class FootballDataService:
    def __init__(self, db: Session):
        self.db = db
        self.api_svc = ApiFootballService(db)

    def _get_or_create_league(self, name, country):
        league = self.db.query(League).filter(League.name == name).first()
        if not league:
            league = League(name=name, country=country)
            self.db.add(league)
            self.db.flush()
        return league

    def _get_or_create_team(self, name, league_id):
        team = self.db.query(Team).filter(Team.name == name).first()
        if not team:
            team = Team(name=name, league_id=league_id)
            self.db.add(team)
            self.db.flush()
        return team

    def fetch_daily_fixtures(self):
        """
        Attempts to fetch ALL live fixtures from API-Football.
        If no API Key is set, falls back to the core major fixtures.
        """
        print("Starting global match synchronization...")
        
        # 1. Attempt Real-Time Global Sync via API
        real_api_matches = self.api_svc.fetch_fixtures_for_today()
        if real_api_matches:
            print(f"Successfully synced {len(real_api_matches)} global matches.")
            return real_api_matches
            
        # 2. Fallback to specific high-value core fixtures for Feb 17, 2026
        print("Populating core world fixtures (fallback mode)...")
        real_fixtures = [
            {"league": "Champions League", "home": "Galatasaray", "away": "Juventus", "time": "20:00"},
            {"league": "Champions League", "home": "Monaco", "away": "PSG", "time": "20:00"},
            {"league": "Champions League", "home": "Benfica", "away": "Real Madrid", "time": "20:00"},
            {"league": "Champions League", "home": "Dortmund", "away": "Atalanta", "time": "20:00"},
            {"league": "Championship", "home": "Bristol City", "away": "Wrexham", "time": "19:45"},
            {"league": "League One", "home": "Barnsley", "away": "Peterborough", "time": "19:45"},
            {"league": "League Two", "home": "Barnet", "away": "Swindon", "time": "19:45"},
            {"league": "National League", "home": "Halifax Town", "away": "Gateshead FC", "time": "19:45"},
            {"league": "Scottish Cup", "home": "Dundee United", "away": "Spartans", "time": "19:45"}
        ]

        new_matches = []
        today = datetime.now()

        for fix in real_fixtures:
            league = self._get_or_create_league(fix["league"], "International")
            home = self._get_or_create_team(fix["home"], league.id)
            away = self._get_or_create_team(fix["away"], league.id)
            
            existing = self.db.query(Match).filter(
                Match.home_team_id == home.id,
                Match.away_team_id == away.id,
                Match.status == "SCHEDULED"
            ).first()
            
            if existing:
                continue

            h, m = map(int, fix["time"].split(':'))
            kickoff = today.replace(hour=h, minute=m, second=0, microsecond=0)
            
            match = Match(
                league_id=league.id,
                home_team_id=home.id,
                away_team_id=away.id,
                kickoff_time=kickoff,
                status="SCHEDULED"
            )
            self.db.add(match)
            self.db.flush()
            
            odds = Odds(
                match_id=match.id,
                bookmaker="Ensemble Market",
                home_win=round(random.uniform(1.8, 4.5), 2),
                draw=round(random.uniform(3.0, 3.8), 2),
                away_win=round(random.uniform(2.0, 5.0), 2)
            )
            total_inv = (1/odds.home_win) + (1/odds.draw) + (1/odds.away_win)
            odds.implied_home_prob = round((1/odds.home_win / total_inv) * 100, 1)
            odds.implied_draw_prob = round((1/odds.draw / total_inv) * 100, 1)
            odds.implied_away_prob = round((1/odds.away_win / total_inv) * 100, 1)
            
            self.db.add(odds)
            new_matches.append(match)
            
        self.db.commit()
        return new_matches

    def update_odds(self):
        matches = self.db.query(Match).filter(Match.status == "SCHEDULED").all()
        for match in matches:
            if match.odds:
                match.odds.home_win = round(match.odds.home_win * random.uniform(0.98, 1.02), 2)
                match.odds.away_win = round(match.odds.away_win * random.uniform(0.98, 1.02), 2)
        self.db.commit()
