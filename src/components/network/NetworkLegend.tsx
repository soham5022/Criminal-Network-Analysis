import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export const NetworkLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const nodeTypes = [
    { label: 'Person (Suspect/Lead)', shape: 'w-3 h-3 rounded-full bg-[#12304A] border border-[#234E70]' },
    { label: 'Phone (Burner SIM)', shape: 'w-3.5 h-2.5 rounded-sm bg-[#087E8B] border border-[#06636E]' },
    { label: 'Account (Ledger)', shape: 'w-3 h-3 rotate-45 rounded-[1px] bg-[#2563A6] border border-[#1D4ED8]' },
    { label: 'Location (Rendezvous)', shape: 'w-3 h-3 rounded-none bg-[#7E22CE] border border-[#6B21A8]' },
    { label: 'Organization (Corporate)', shape: 'w-3 h-3 rotate-45 bg-[#234E70] border border-[#12304A]' },
    { label: 'Vehicle (Transport)', shape: 'w-3 h-3 rotate-45 rounded-sm bg-[#B7791F] border border-[#92400E]' }
  ];

  const edgeTypes = [
    { label: 'CALLED (Telephony)', line: 'w-4 h-0.5 border-t border-dashed border-[#087E8B]' },
    { label: 'TRANSFERRED (SWIFT/Wire)', line: 'w-4 h-0.5 bg-[#B7791F]' },
    { label: 'VISITED / CO-LOCATED', line: 'w-4 h-0.5 bg-[#7E22CE]' },
    { label: 'MET (Physical Rendezvous)', line: 'w-4 h-0.5 bg-[#C24141]' },
    { label: 'ASSOCIATED WITH', line: 'w-4 h-0.5 bg-[#234E70]' },
    { label: 'OWNS / OPERATES', line: 'w-4 h-0.5 bg-[#16805C]' }
  ];

  return (
    <div className="bg-[#FFFFFF] px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-xs select-none shadow-sm">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer py-0.5 hover:text-[#12304A] text-[#64748B]"
      >
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#12304A]">
          <Info className="w-3.5 h-3.5 text-[#087E8B]" />
          <span>Investigation Graph Legend</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
          <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand Shapes & Link Styles'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </div>

      {isExpanded && (
        <div className="pt-2.5 mt-2 border-t border-[#E2E8F0] space-y-2.5 animate-in fade-in">
          {/* Node Shapes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {nodeTypes.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className={`${item.shape} flex-shrink-0 flex items-center justify-center`} />
                <span className="text-[11px] text-[#17212B] truncate">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Edge Line Types */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 border-t border-[#E2E8F0]">
            {edgeTypes.map((edge, idx) => (
              <div key={idx} className="flex items-center gap-2 p-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className={edge.line} />
                <span className="text-[10px] text-[#475569] truncate">{edge.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
