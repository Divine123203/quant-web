'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { TrendingUp, AlertTriangle, Activity, Calendar } from 'lucide-react';

const PERFORMANCE_DATA = [
  { month: 'Jan', edge: 2.4, roi: 5.2, risk: 1.2 },
  { month: 'Feb', edge: 3.1, roi: 8.5, risk: 1.5 },
  { month: 'Mar', edge: 4.2, roi: 12.1, risk: 1.8 },
  { month: 'Apr', edge: 3.8, roi: 10.4, risk: 1.4 },
  { month: 'May', edge: 5.1, roi: 15.6, risk: 2.1 },
  { month: 'Jun', edge: 4.5, roi: 14.2, risk: 1.9 },
  { month: 'Jul', edge: 4.8, roi: 16.8, risk: 2.0 },
];

const CALIBRATION_DATA = [
  { prob: 10, actual: 12 },
  { prob: 20, actual: 18 },
  { prob: 30, actual: 29 },
  { prob: 40, actual: 42 },
  { prob: 50, actual: 48 },
  { prob: 60, actual: 61 },
  { prob: 70, actual: 69 },
  { prob: 80, actual: 82 },
  { prob: 90, actual: 88 },
];

export default function Performance() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Model Performance</h1>
          <p className="text-muted-foreground">Historical backtesting results and real-time calibration metrics.</p>
        </div>
        <div className="flex gap-2">
           <select className="bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
             <option>Last 6 Months</option>
             <option>Year to Date</option>
             <option>All Time</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between">
           <div>
             <p className="text-sm font-medium text-gray-400">Total ROI</p>
             <h3 className="text-3xl font-bold text-emerald-400 mt-2">+16.8%</h3>
             <p className="text-xs text-emerald-500/80 mt-1 flex items-center gap-1">
               <TrendingUp size={12} /> +2.4% this month
             </p>
           </div>
           
           <div className="mt-8">
             <p className="text-sm font-medium text-gray-400">Sharpe Ratio</p>
             <h3 className="text-2xl font-bold text-blue-400 mt-1">1.82</h3>
           </div>
        </div>

        <div className="lg:col-span-3 glass-panel p-6 rounded-xl min-h-[300px]">
           <h3 className="text-lg font-semibold mb-4 text-white">Cumulative Returns vs Market Baseline</h3>
           <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={PERFORMANCE_DATA}>
                 <defs>
                   <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                 <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }}
                   itemStyle={{ color: '#f3f4f6' }}
                 />
                 <Area type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRoi)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Activity size={18} className="text-blue-400" />
              Probability Calibration
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Ideally, points should fall exactly on the diagonal line. Deviations indicate under/over-confidence.
            </p>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={CALIBRATION_DATA}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                   <XAxis dataKey="prob" stroke="#666" label={{ value: 'Predicted Probability', position: 'insideBottom', offset: -5 }} />
                   <YAxis stroke="#666" label={{ value: 'Actual Frequency', angle: -90, position: 'insideLeft' }} />
                   <Tooltip />
                   <Legend />
                   <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Observed" />
                   <Line type="monotone" dataKey="prob" stroke="#666" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Ideal" />
                 </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="glass-panel p-6 rounded-xl">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Monthly Breakdown</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                   <Calendar size={12} /> View Full History
                </button>
             </div>
             
             <div className="space-y-4">
               {PERFORMANCE_DATA.slice().reverse().map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                          {item.month}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-200">Edge Found</p>
                          <p className="text-xs text-gray-500">{item.edge}% avg.</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`font-bold ${item.roi >= 10 ? 'text-emerald-400' : 'text-emerald-500/80'}`}>+{item.roi}%</p>
                        <p className="text-xs text-gray-500">ROI</p>
                     </div>
                  </div>
               ))}
             </div>
         </div>
      </div>
    </div>
  );
}
