import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Share2 } from 'lucide-react';
import { mockRelationshipDistribution } from '../../data/mockAnalytics';

export const RelationshipChart: React.FC = () => {
  return (
    <div className="intel-card p-5 rounded-xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Relationship Edge Types</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            4,821 total links classified by algorithmic source verification.
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={mockRelationshipDistribution} 
            layout="vertical"
            margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis 
              type="category" 
              dataKey="type" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              fontFamily="JetBrains Mono, monospace"
              width={80}
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
              formatter={(value: any, name: any, item: any) => [
                `${value} edges (Avg Conf: ${Math.round(item.payload.avgConfidence * 100)}%)`,
                item.payload.name
              ]}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {mockRelationshipDistribution.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
