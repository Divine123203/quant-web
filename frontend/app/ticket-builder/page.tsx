'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sliders, CheckCircle, AlertTriangle, Play, RefreshCw, Loader2, Save } from 'lucide-react';
import api from '@/lib/api';

export default function TicketBuilder() {
  const [gameCount, setGameCount] = useState(5);
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'Aggressive'>('Medium');
  const [marketType, setMarketType] = useState('Mixed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [matches, setMatches] = useState<any[]>([]);
  const [ticketStats, setTicketStats] = useState({ totalOdds: 0, expectedReturn: 0 });
  const router = useRouter();

  useEffect(() => {
    // Auth check removed
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSaveStatus(null);
    try {
      const response = await api.post('tickets/generate', {
        gameCount,
        riskLevel,
        marketType
      });
      
      const data = response.data;
      setMatches(data.matches);
      setTicketStats({ totalOdds: data.totalOdds, expectedReturn: data.expectedReturn });
    } catch (e) {
      console.error("Ticket generation failed", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (matches.length === 0) return;
    setIsSaving(true);
    try {
      await api.post('tickets/save', {
        total_odds: ticketStats.totalOdds,
        potential_return: ticketStats.expectedReturn,
        matches: matches.map(m => ({
          home_team: m.home_team,
          away_team: m.away_team,
          league: m.league,
          kickoff_time: m.kickoff_time,
          prediction: m.prediction?.predicted_outcome
        }))
      });
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      console.error("Failed to save ticket", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Smart Ticket Builder</h1>
          <p className="text-muted-foreground">AI-optimized accumulator generation based on your risk profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Sliders size={20} className="text-blue-400" />
              Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Number of Games: {gameCount}</label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={gameCount}
                  onChange={(e) => setGameCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2</span>
                  <span>20</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Risk Profile</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'Aggressive'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setRiskLevel(level as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                        riskLevel === level
                          ? level === 'Low' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : level === 'Medium' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-red-500/20 border-red-500 text-red-400'
                          : 'bg-card border-white/5 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {riskLevel === 'Low' && 'High probability matches (>65%). Lower returns, higher stability.'}
                  {riskLevel === 'Medium' && 'Balanced mix (55-65%). Optimal risk/reward ratio.'}
                  {riskLevel === 'Aggressive' && 'High value plays (45-55%). Volatile but high potential returns.'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Market Preference</label>
                <select 
                  value={marketType}
                  onChange={(e) => setMarketType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Mixed (Recommended)</option>
                  <option>Home Wins Only</option>
                  <option>Away Wins Only</option>
                  <option>Double Chance</option>
                  <option>Draws (High Risk)</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="animate-spin" size={20} />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play size={20} className="fill-current" />
                      Generate Ticket
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Preview */}
        <div className="lg:col-span-2">
            <div className="glass-panel p-6 rounded-xl flex flex-col min-h-[500px]">
              {matches.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                     <div>
                       <h3 className="text-xl font-bold text-white">Optimized Ticket</h3>
                       <div className="flex items-center gap-2">
                         <p className="text-sm text-gray-400">{matches.length} Fold Accumulator</p>
                         <button 
                           onClick={() => setMatches([])}
                           className="text-[10px] uppercase tracking-wider bg-white/5 hover:bg-white/10 text-gray-400 px-2 py-0.5 rounded transition-colors"
                         >
                           Clear
                         </button>
                       </div>
                     </div>
                     <div className="text-right">
                        <p className="text-emerald-400 font-bold text-2xl">{ticketStats.totalOdds}x</p>
                        <p className="text-xs text-gray-500">Combined Odds</p>
                     </div>
                  </div>
                  
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[350px] mb-4">
                    {matches.map((m: any) => (
                      <div key={m.id} className="bg-gray-800/50 p-4 rounded-lg flex justify-between items-center border border-white/5">
                         <div> 
                            <p className="font-bold text-white">{m.home_team} vs {m.away_team}</p>
                            <p className="text-xs text-gray-400">{new Date(m.kickoff_time).toLocaleString()}</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-sm font-bold">
                              {m.prediction?.predicted_outcome}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-800 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-gray-400 text-sm">Potential Return (N10 Stake)</span>
                       <span className="text-2xl font-bold text-white">N{ticketStats.expectedReturn}</span>
                    </div>
                    
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-white/10"
                    >
                      {isSaving ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : saveStatus ? (
                        <CheckCircle className="text-emerald-400" size={18} />
                      ) : (
                        <Save size={18} />
                      )}
                      {saveStatus || 'Save to History'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center border-dashed border-2 border-gray-800 rounded-lg p-10">
                   <div className="bg-gray-800/50 p-6 rounded-full mb-4">
                     <CheckCircle size={48} className="text-gray-600" />
                   </div>
                   <h3 className="text-xl font-medium text-gray-300">Ready to Build</h3>
                   <p className="text-gray-500 max-w-md mt-2">
                     Configure your preferences on the left and hit "Generate Ticket" to let our AI assemble the optimal betting slip.
                   </p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
