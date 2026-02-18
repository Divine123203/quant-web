'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Clock, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchHistory() {
      try {
        const response = await api.get('/tickets/history');
        setHistory(response.data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [router]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Betting History</h1>
          <p className="text-muted-foreground">Review your past generated and saved tickets.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={48} />
        </div>
      ) : history.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {history.map((ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel overflow-hidden rounded-xl border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Generated on</p>
                      <p className="text-white font-medium">
                        {new Date(ticket.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Odds</p>
                      <p className="text-emerald-400 text-xl font-bold">{ticket.total_odds}x</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Potential Return</p>
                      <p className="text-white text-xl font-bold">N{ticket.potential_return}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Matches included</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ticket.matches_json.map((match: any, idx: number) => (
                      <div key={idx} className="bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/5">
                        <div className="truncate pr-2">
                          <p className="text-sm text-white font-medium truncate">{match.home_team} vs {match.away_team}</p>
                          <p className="text-[10px] text-gray-500">{match.league}</p>
                        </div>
                        <div className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded">
                          {match.prediction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-20 rounded-xl text-center border-dashed border-2 border-white/10">
          <HistoryIcon size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-300">No History Found</h3>
          <p className="text-gray-500 mt-2">Generate and save your first ticket to see it here.</p>
        </div>
      )}
    </div>
  );
}
