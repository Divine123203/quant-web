'use client';

import { motion } from 'framer-motion';
import { Share2, ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function MatchDetail() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
          <ArrowLeft size={20} className="text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Arsenal vs Man City</h1>
          <p className="text-muted-foreground text-sm">Premier League • Today, 17:30</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Share2 size={16} /> Share Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <div className="lg:col-span-2 space-y-6">
           {/* Win Probability */}
           <div className="glass-panel p-6 rounded-xl">
             <h3 className="text-lg font-semibold mb-6 text-white">Win Probability</h3>
             <div className="flex items-center justify-between gap-8 mb-8">
               <div className="text-center">
                  <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center text-2xl font-bold text-blue-400">42%</div>
                  <p className="mt-2 font-medium text-gray-300">Arsenal</p>
               </div>
               <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-600 flex items-center justify-center text-lg font-bold text-gray-400">32%</div>
                  <p className="mt-2 font-medium text-gray-400">Draw</p>
               </div>
               <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center text-xl font-bold text-emerald-400">26%</div>
                  <p className="mt-2 font-medium text-gray-300">Man City</p>
               </div>
             </div>
             
             <div className="bg-gray-800/50 rounded-lg p-4 flex justify-between items-center text-sm">
                <span className="text-gray-400">Model Confidence: <b className="text-white">High (85%)</b></span>
                <span className="text-gray-400">Sample Size: <b className="text-white">5,420 sims</b></span>
             </div>
           </div>

           {/* Feature Importance */}
           <div className="glass-panel p-6 rounded-xl">
             <h3 className="text-lg font-semibold mb-4 text-white">Key Factors (SHAP)</h3>
             <div className="space-y-3">
               {[
                 { label: 'Arsenal Home Form (Last 5)', val: '+12.4%', color: 'bg-emerald-500' },
                 { label: 'Man City Injuries', val: '+8.2%', color: 'bg-emerald-500' },
                 { label: 'H2H Record', val: '-5.1%', color: 'bg-red-500' },
                 { label: 'Market Sentiment', val: '-2.3%', color: 'bg-red-500' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4">
                   <span className="w-48 text-sm text-gray-400 text-right">{item.label}</span>
                   <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: item.val.replace(/[-+%]/g, '') + '0%' }} />
                   </div>
                   <span className={`w-12 text-sm font-mono ${item.val.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{item.val}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Sidebar Odds */}
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-xl bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                 <TrendingUp size={20} />
                 <span className="font-bold">Value Detected</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">8.5% Edge</p>
              <p className="text-sm text-gray-400">On Home Win @ 2.45</p>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                 <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                    Open in SportyBet
                 </button>
                 <button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                    Open in Bet9ja
                 </button>
                 <button className="w-full py-3 bg-black hover:bg-gray-900 border border-gray-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                    Open in Betway
                 </button>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-xl">
             <h3 className="text-lg font-semibold mb-4 text-white">Risk Analysis</h3>
             <div className="flex items-start gap-3">
               <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
               <div>
                  <h4 className="font-medium text-amber-400">Medium Volatility</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Historical interactions suggest high likelihood of unexpected tactical shifts. Recommended usage: <span className="text-white">Single Bet</span>.
                  </p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
