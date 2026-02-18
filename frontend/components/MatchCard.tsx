'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';

interface MatchProps {
    homeTeam: string;
    awayTeam: string;
    league: string;
    kickoff: string;
    probs: { home: number; draw: number; away: number };
    implied: { home: number; draw: number; away: number };
    edge: number;
    risk: 'Low' | 'Medium' | 'High';
    prediction: 'Home' | 'Draw' | 'Away';
}

export function MatchCard({ match }: { match: MatchProps }) {
    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
            case 'Medium': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
            case 'High': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card relative overflow-hidden rounded-xl bg-card/60 border border-white/5 p-5 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{match.league} • {match.kickoff}</span>
                </div>

                <div className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border", getRiskColor(match.risk))}>
                    {match.risk === 'Low' ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                    {match.risk} Risk
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 text-center">
                    <h3 className="font-bold text-lg text-foreground truncate">{match.homeTeam}</h3>
                    <div className="text-xs text-muted-foreground mt-1">HOME</div>
                </div>
                <div className="text-muted-foreground font-mono text-xs">VS</div>
                <div className="flex-1 text-center">
                    <h3 className="font-bold text-lg text-foreground truncate">{match.awayTeam}</h3>
                    <div className="text-xs text-muted-foreground mt-1">AWAY</div>
                </div>
            </div>

            <div className="space-y-3">
                {/* Prediction Bar */}
                <div className="relative h-2 w-full bg-secondary/50 rounded-full overflow-hidden flex">
                    <div
                        style={{ width: `${match.probs.home}%` }}
                        className="h-full bg-blue-500"
                        title={`Home: ${match.probs.home}%`}
                    />
                    <div
                        style={{ width: `${match.probs.draw}%` }}
                        className="h-full bg-gray-500/50"
                        title={`Draw: ${match.probs.draw}%`}
                    />
                    <div
                        style={{ width: `${match.probs.away}%` }}
                        className="h-full bg-emerald-500"
                        title={`Away: ${match.probs.away}%`}
                    />
                </div>

                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                    <span>{match.probs.home}%</span>
                    <span>{match.probs.draw}%</span>
                    <span>{match.probs.away}%</span>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Highest Edge</span>
                    <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                        <ArrowUpRight size={16} />
                        +{match.edge}%
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">Implied Prob.</span>
                    <span className="text-sm font-medium text-foreground">
                        {match.prediction === 'Home' ? match.implied.home : match.prediction === 'Away' ? match.implied.away : match.implied.draw}%
                    </span>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

        </motion.div>
    );
}
