'use client';

import { MatchCard } from '@/components/MatchCard';
import { BadgeCheck, TrendingUp, Sliders, Activity, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMatches } from '@/lib/api';
import api from '@/lib/api'; // Ensure default export is used for POST calls
import { Match } from '@/types';

const MOCK_MATCHES = [
  {
    id: 1,
    homeTeam: 'Arsenal',
    awayTeam: 'Man City',
    league: 'Premier League',
    kickoff: '17:30',
    probs: { home: 42, draw: 32, away: 26 },
    implied: { home: 38, draw: 28, away: 34 },
    edge: 8.5,
    risk: 'High' as const,
    prediction: 'Home' as const
  },
  {
    id: 2,
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    league: 'La Liga',
    kickoff: '20:00',
    probs: { home: 35, draw: 40, away: 25 },
    implied: { home: 45, draw: 25, away: 30 },
    edge: 15.2,
    risk: 'Medium' as const,
    prediction: 'Draw' as const
  },
  {
    id: 3,
    homeTeam: 'Juventus',
    awayTeam: 'AC Milan',
    league: 'Serie A',
    kickoff: '19:45',
    probs: { home: 55, draw: 25, away: 20 },
    implied: { home: 50, draw: 30, away: 20 },
    edge: 5.0,
    risk: 'Low' as const,
    prediction: 'Home' as const
  },
  {
    id: 4,
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    league: 'Bundesliga',
    kickoff: '18:30',
    probs: { home: 65, draw: 20, away: 15 },
    implied: { home: 60, draw: 25, away: 15 },
    edge: 4.2,
    risk: 'Low' as const,
    prediction: 'Home' as const
  },
  {
    id: 5,
    homeTeam: 'PSG',
    awayTeam: 'Lyon',
    league: 'Ligue 1',
    kickoff: '21:00',
    probs: { home: 60, draw: 25, away: 15 },
    implied: { home: 55, draw: 25, away: 20 },
    edge: 6.1,
    risk: 'Medium' as const,
    prediction: 'Home' as const
  },
  {
    id: 6,
    homeTeam: 'Benfica',
    awayTeam: 'Porto',
    league: 'Primeira Liga',
    kickoff: '20:30',
    probs: { home: 30, draw: 45, away: 25 },
    implied: { home: 35, draw: 30, away: 35 },
    edge: 12.8,
    risk: 'High' as const,
    prediction: 'Draw' as const
  }
];

export default function Dashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await getMatches();
        console.log("Fetched matches:", data);
        setMatches(data);
      } catch (err) {
        console.error("Failed to load matches", err);
        setError('Failed to load live data. Showing demo mode.');
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  // Use mock matches if API returns empty (for demo purposes if needed)
  const displayMatches = matches.length > 0 ? matches : []; 
  
  // Or map to UI props
  const mappedMatches = displayMatches.map(m => {
     const pred = m.prediction;
     let formattedTime = 'TBD';
     try {
       if (m.kickoff_time) {
         formattedTime = new Date(m.kickoff_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
       }
     } catch (e) {
       console.error("Invalid date", m.kickoff_time);
     }

     return {
       id: m.id,
       homeTeam: m.home_team || 'Unknown',
       awayTeam: m.away_team || 'Unknown',
       league: m.league || 'Global',
       kickoff: formattedTime,
       probs: { 
         home: pred?.home_prob || 0, 
         draw: pred?.draw_prob || 0, 
         away: pred?.away_prob || 0 
       },
       implied: { 
         home: m.odds?.home_win ? Math.round(100 / m.odds.home_win) : 0, 
         draw: m.odds?.draw ? Math.round(100 / m.odds.draw) : 0, 
         away: m.odds?.away_win ? Math.round(100 / m.odds.away_win) : 0 
       },
       edge: pred?.edge || 0,
       risk: (pred?.risk_level ? pred.risk_level.charAt(0).toUpperCase() + pred.risk_level.slice(1).toLowerCase() : 'Medium') as 'Low' | 'Medium' | 'High',
       prediction: (pred?.predicted_outcome === 'HOME' ? 'Home' : pred?.predicted_outcome === 'AWAY' ? 'Away' : 'Draw') as 'Home' | 'Away' | 'Draw'
     };
  });

  // Combine with Mock if empty to show UI
  const finalMatches = mappedMatches.length > 0 ? mappedMatches : MOCK_MATCHES;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await api.post('system/refresh'); // Already a relative path
      // Reload matches after refresh
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Market Overview</h1>
          <p className="text-muted-foreground flex items-center gap-2">
             Real-time edge detection across major leagues.
             {matches.length > 0 ? (
               <span className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <Activity size={12} /> Live Data Active
               </span>
             ) : (
               <span className="text-amber-400 text-xs bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Demo Mode
               </span>
             )}
          </p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
               {loading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
               Sync Real-World Games
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-xl flex items-center gap-3">
          <AlertTriangle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card/40 border border-white/5 rounded-xl p-5 backdrop-blur-sm hover:bg-card/60 transition-colors">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Total Edge Found</p>
               <h3 className="text-2xl font-bold mt-1 text-emerald-400">+12.4%</h3>
             </div>
             <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
               <TrendingUp size={20} />
             </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Average across 42 matches</p>
        </div>
        
        <div className="bg-card/40 border border-white/5 rounded-xl p-5 backdrop-blur-sm hover:bg-card/60 transition-colors">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Draw Pick Win Rate</p>
               <h3 className="text-2xl font-bold mt-1 text-blue-400">68%</h3>
             </div>
             <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
               <Activity size={20} />
             </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Last 30 days (Top 5 Leagues)</p>
        </div>

        <div className="bg-card/40 border border-white/5 rounded-xl p-5 backdrop-blur-sm hover:bg-card/60 transition-colors">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Model Accuracy</p>
               <h3 className="text-2xl font-bold mt-1 text-purple-400">74.2%</h3>
             </div>
             <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
               <BadgeCheck size={20} />
             </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Calibration Error &lt; 2.5%</p>
        </div>

        <div className="bg-card/40 border border-white/5 rounded-xl p-5 backdrop-blur-sm hover:bg-card/60 transition-colors">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-muted-foreground">Risk Exposure</p>
               <h3 className="text-2xl font-bold mt-1 text-amber-400">Medium</h3>
             </div>
             <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
               <Sliders size={20} />
             </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Based on current portfolio</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">High Value Opportunities</h2>
          <div className="flex gap-2 text-sm text-muted-foreground">
             <span className="cursor-pointer hover:text-white transition-colors">Today</span>
             <span>•</span>
             <span className="cursor-pointer hover:text-white transition-colors">Matchday 32</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
           {loading ? (
             <div className="col-span-3 flex justify-center py-20">
               <Loader2 className="animate-spin text-blue-500" size={48} />
             </div>
           ) : (
             finalMatches.map((match) => (
               <MatchCard key={match.id} match={match} />
             ))
           )}
        </div>
      </div>
    </div>
  );
}
