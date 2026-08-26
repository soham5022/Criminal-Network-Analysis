import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, Sparkles } from 'lucide-react';
import { mockActivityTrends } from '../../data/mockAnalytics';

export const ActivityChart: React.FC = () => {
  return (
    <div className="intel-card p-5 rounded-xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Investigation Activity (Last 30 Days)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated ingestion events across CDR intercepts, banking transactions, and geo-sightings.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>Real-Time Event Stream</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockActivityTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cdrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="finGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="dayDisplay" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0c1424', 
                borderColor: '#1e2e4e', 
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)'
              }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <Area 
              type="monotone" 
              dataKey="cdrEvents" 
              name="CDR Records" 
              stroke="#06b6d4" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#cdrGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="financialTransactions" 
              name="Bank Transfers" 
              stroke="#f59e0b" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#finGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="flaggedAnomalies" 
              name="Flagged Anomalies" 
              stroke="#f43f5e" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#anomalyGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
