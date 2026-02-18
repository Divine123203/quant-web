export interface Match {
  id: number;
  home_team: string;
  away_team: string;
  league: string;
  kickoff_time: string;
  status: string;
  prediction?: Prediction;
  odds?: Odds;
}

export interface Odds {
  home_win: number;
  draw: number;
  away_win: number;
}

export interface Prediction {
  id: number;
  match_id: number;
  home_prob: number;
  draw_prob: number;
  away_prob: number;
  predicted_outcome: 'HOME' | 'DRAW' | 'AWAY';
  edge: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TicketRequest {
  gameCount: number;
  riskLevel: 'Low' | 'Medium' | 'Aggressive';
  marketType: string;
}

export interface TicketResponse {
  matches: Match[];
  totalOdds: number;
  expectedReturn: number;
}
