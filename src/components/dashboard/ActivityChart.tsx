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
import { Activity } from 'lucide-react';
import { mockActivityTrends } from '../../data/mockAnalytics';

export const ActivityChart: React.FC = () => {
  return (
    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#087E8B]" />
            <span>Investigation Activity (Last 30 Days)</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Aggregated ingestion events across CDR intercepts, banking transactions, and geo-sightings.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E6F4F5] border border-[#A7DFE3] text-[11px] font-mono text-[#087E8B] font-bold">
          <span>Real-Time Event Stream</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockActivityTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cdrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#087E8B" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#087E8B" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="finGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563A6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#2563A6" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C24141" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#C24141" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis 
              dataKey="dayDisplay" 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderColor: '#CBD5E1', 
                borderRadius: '6px',
                fontSize: '12px',
                color: '#12304A',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}
            />
            <Area 
              type="monotone" 
              dataKey="cdrEvents" 
              name="CDR Records" 
              stroke="#087E8B" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#cdrGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="financialTransactions" 
              name="Bank Transfers" 
              stroke="#2563A6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#finGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="flaggedAnomalies" 
              name="Flagged Anomalies" 
              stroke="#C24141" 
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
