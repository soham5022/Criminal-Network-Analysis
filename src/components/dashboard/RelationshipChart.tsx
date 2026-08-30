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
    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#087E8B]" />
            <span>Relationship Edge Types</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
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
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="#64748B" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis 
              type="category" 
              dataKey="type" 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              fontFamily="JetBrains Mono, monospace"
              width={80}
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
