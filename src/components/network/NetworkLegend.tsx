import React from 'react';
import { Info } from 'lucide-react';

export const NetworkLegend: React.FC = () => {
  const nodeTypes = [
    { label: 'Person', color: 'bg-[#0284c7]', border: 'border-[#38bdf8]', shape: 'rounded-full' },
    { label: 'Phone', color: 'bg-[#059669]', border: 'border-[#34d399]', shape: 'rotate-45 rounded-sm' },
    { label: 'Account', color: 'bg-[#d97706]', border: 'border-[#fbbf24]', shape: 'rounded-sm' },
    { label: 'Location', color: 'bg-[#7c3aed]', border: 'border-[#c084fc]', shape: 'rounded-md' },
    { label: 'Organization', color: 'bg-[#4f46e5]', border: 'border-[#818cf8]', shape: 'rounded' },
    { label: 'Vehicle', color: 'bg-[#e11d48]', border: 'border-[#fb7185]', shape: 'rounded-sm' }
  ];

  const relationshipTypes = [
    { label: 'CALLED (Telephony)', color: 'text-cyan-400', line: 'bg-cyan-400' },
    { label: 'TRANSFERRED (Financial)', color: 'text-amber-400', line: 'bg-amber-400' },
    { label: 'FLAGGED ANOMALY', color: 'text-rose-400', line: 'bg-rose-400 border-dashed' },
    { label: 'GENERAL LINK', color: 'text-slate-400', line: 'bg-slate-500' }
  ];

  return (
    <div className="intel-card p-3 rounded-xl border border-slate-800 space-y-2.5 text-xs select-none">
      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-300 uppercase tracking-wider">
        <Info className="w-3.5 h-3.5 text-cyan-400" />
        <span>Graph Visual Legend</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {nodeTypes.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className={`w-3.5 h-3.5 ${item.color} ${item.border} ${item.shape} border flex-shrink-0`} />
            <span className="text-[11px] text-slate-300 truncate">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        {relationshipTypes.map((r, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <div className={`w-4 h-0.5 ${r.line}`} />
            <span className={r.color}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
