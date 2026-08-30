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
    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-[#087E8B]" />
            <span>Entity Distribution</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
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
                  stroke="#FFFFFF" 
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderColor: '#CBD5E1', 
                borderRadius: '6px',
                fontSize: '12px',
                color: '#12304A',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
