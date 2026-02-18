'use client';

import { useState } from 'react';
import { Save, Bell, Shield, Database, Sliders } from 'lucide-react';

export default function Settings() {
  const [edgeThreshold, setEdgeThreshold] = useState(5.0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">System Settings</h1>
          <p className="text-muted-foreground">Configure global parameters and alert thresholds.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
           <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Betting Parameters */}
        <section className="glass-panel p-6 rounded-xl space-y-6">
           <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
              <Sliders className="text-blue-400" size={22} />
              Betting Logic
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Edge Threshold ({edgeThreshold}%)
                 </label>
                 <input 
                   type="range" 
                   min="0.5" 
                   max="15.0" 
                   step="0.1" 
                   value={edgeThreshold}
                   onChange={(e) => setEdgeThreshold(parseFloat(e.target.value))}
                   className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
                 <p className="text-xs text-gray-500 mt-2">
                    Only matches with a model edge greater than this value will be flagged as opportunities.
                 </p>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">Model Version</label>
                 <select className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500">
                    <option>v2.4.1 (Stable - Ensemble)</option>
                    <option>v2.5.0-beta (Experimental - Deep Learning)</option>
                    <option>v1.2.0 (Legacy - Logistic Regression)</option>
                 </select>
              </div>
           </div>
        </section>

        {/* Notifications */}
        <section className="glass-panel p-6 rounded-xl space-y-6">
           <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
              <Bell className="text-amber-400" size={22} />
              Alert Preferences
           </h3>
           
           <div className="space-y-4">
              {[
                { id: 'email', label: 'Email Reports', desc: 'Daily summary of top picks and performance metrics.' },
                { id: 'push', label: 'Push Notifications', desc: 'Real-time alerts for high-value edge detection.' },
                { id: 'sms', label: 'SMS Alerts', desc: 'Critical system warnings and account security.' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                   <div>
                      <h4 className="font-medium text-gray-200">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications[item.id as keyof typeof notifications]}
                        onChange={() => setNotifications({...notifications, [item.id]: !notifications[item.id as keyof typeof notifications]})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                   </label>
                </div>
              ))}
           </div>
        </section>

        {/* System & Data */}
        <section className="glass-panel p-6 rounded-xl space-y-6">
           <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
              <Database className="text-emerald-400" size={22} />
              Data Management
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors group">
                 <h4 className="font-medium text-gray-200 group-hover:text-white">Clear Cache</h4>
                 <p className="text-xs text-gray-500 mt-1">Remove temporary calculation data from Redis.</p>
              </button>
              
              <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-left transition-colors group">
                 <h4 className="font-medium text-gray-200 group-hover:text-white">Force Retrain</h4>
                 <p className="text-xs text-gray-500 mt-1">Trigger immediate model retraining pipeline.</p>
              </button>
           </div>
        </section>
      </div>
    </div>
  );
}
