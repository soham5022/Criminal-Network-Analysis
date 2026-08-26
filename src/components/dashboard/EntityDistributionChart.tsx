import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Users } from 'lucide-react';
import { mockEntityDistribution } from '../../data/mockAnalytics';

export const EntityDistributionChart: React.FC = () => {
  return (
    <div className="intel-card p-5 rounded-xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Entity Distribution</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total 1,284 nodes mapped across 6 operational domains.
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockEntityDistribution}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="count"
            >
              {mockEntityDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="#0c1424" 
                  strokeWidth={2}
                />
              ))}
            </Pie>
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
                `${value} entities (${item.payload.percentage}%)`,
                name
              ]}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
