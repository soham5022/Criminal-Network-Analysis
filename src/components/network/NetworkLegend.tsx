import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const NetworkLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const nodeTypes = [
    { label: 'Person (Suspect/Lead)', shape: 'w-3 h-3 rounded-full bg-[#1e40af] border border-[#60a5fa]' },
    { label: 'Phone (Burner SIM)', shape: 'w-3.5 h-2.5 rounded-sm bg-[#065f46] border border-[#34d399]' },
    { label: 'Account (Ledger)', shape: 'w-3 h-3 rotate-45 rounded-[1px] bg-[#92400e] border border-[#fbbf24]' },
    { label: 'Location (Rendezvous)', shape: 'w-3 h-3 rounded-none bg-[#5b21b6] border border-[#a78bfa]' },
    { label: 'Organization (Corporate)', shape: 'w-3 h-3 rotate-45 bg-[#3730a3] border border-[#818cf8]' },
    { label: 'Vehicle (Transport)', shape: 'w-3 h-3 rotate-45 rounded-sm bg-[#9f1239] border border-[#fb7185]' }
  ];

  const edgeTypes = [
    { label: 'CALLED (Telephony)', line: 'w-4 h-0.5 border-t border-dashed border-[#0284c7]' },
    { label: 'TRANSFERRED (SWIFT/Wire)', line: 'w-4 h-0.5 bg-[#d97706]' },
    { label: 'VISITED / CO-LOCATED', line: 'w-4 h-0.5 bg-[#7c3aed]' },
    { label: 'MET (Physical Rendezvous)', line: 'w-4 h-0.5 bg-[#e11d48]' },
    { label: 'ASSOCIATED WITH', line: 'w-4 h-0.5 bg-[#4f46e5]' },
    { label: 'OWNS / OPERATES', line: 'w-4 h-0.5 bg-[#059669]' }
  ];

  return (
    <div className="intel-card px-3.5 py-2 rounded-xl border border-slate-800 bg-[#090e1a]/95 backdrop-blur-md text-xs select-none shadow-md">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer py-0.5 hover:text-white text-slate-300"
      >
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-300">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Investigation Graph Legend</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand Shapes & Link Styles'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="pt-2.5 mt-2 border-t border-slate-800 space-y-2.5 animate-in fade-in">
          {/* Node Shapes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {nodeTypes.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className={`${item.shape} flex-shrink-0 flex items-center justify-center`} />
                <span className="text-[11px] text-slate-300 truncate">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Edge Line Types */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 border-t border-slate-800/60">
            {edgeTypes.map((edge, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className={edge.line} />
                <span className="text-[10px] text-slate-300 truncate">{edge.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
