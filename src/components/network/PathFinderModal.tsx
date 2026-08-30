import React, { useState } from 'react';
import { Route, ArrowRight, X, Navigation } from 'lucide-react';
import { CytoscapeNodeData } from '../../services/networkService';

interface PathFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: { data: CytoscapeNodeData }[];
  sourceId: string;
  targetId: string;
  onFindPath: (source: string, target: string) => void;
  activePathSteps?: { from: string; to: string; type: string }[] | null;
  onClearPath: () => void;
}

export const PathFinderModal: React.FC<PathFinderModalProps> = ({
  isOpen,
  onClose,
  nodes,
  sourceId,
  targetId,
  onFindPath,
  activePathSteps,
  onClearPath
}) => {
  const [localSource, setLocalSource] = useState<string>(sourceId || nodes[0]?.data.id || '');
  const [localTarget, setLocalTarget] = useState<string>(targetId || nodes[1]?.data.id || nodes[0]?.data.id || '');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSource && localTarget && localSource !== localTarget) {
      onFindPath(localSource, localTarget);
    }
  };

  return (
    <div className="absolute top-14 left-4 z-40 w-80 bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 text-xs select-none">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-2">
          <Route className="w-3.5 h-3.5 text-[#087E8B]" />
          <span className="font-bold text-[#12304A] font-mono text-xs">Find Connection Path</span>
        </div>
        <button 
          onClick={onClose}
          className="text-[#64748B] hover:text-[#12304A] p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handleApply} className="space-y-2.5">
        <div>
          <label className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">
            Origin Entity
          </label>
          <select
            value={localSource}
            onChange={(e) => setLocalSource(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
          >
            {nodes.map(n => (
              <option key={n.data.id} value={n.data.id}>
                {n.data.id} ({n.data.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center -my-1 text-[#64748B]">
          <ArrowRight className="w-3.5 h-3.5 text-[#087E8B]" />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">
            Destination Entity
          </label>
          <select
            value={localTarget}
            onChange={(e) => setLocalTarget(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
          >
            {nodes.map(n => (
              <option key={n.data.id} value={n.data.id}>
                {n.data.id} ({n.data.type})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 pt-2 border-t border-[#E2E8F0]">
          {activePathSteps && activePathSteps.length > 0 && (
            <button
              type="button"
              onClick={onClearPath}
              className="flex-1 py-1.5 rounded-md bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#64748B] font-semibold text-xs border border-[#CBD5E1] transition-colors"
            >
              Clear Path
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Navigation className="w-3 h-3" />
            <span>Show Path</span>
          </button>
        </div>
      </form>

      {/* Breadcrumb Steps Along the Path */}
      {activePathSteps && activePathSteps.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
            Discovered Path ({activePathSteps.length} Hops):
          </span>
          <div className="space-y-1 bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0] text-[11px] font-mono">
            {activePathSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[#475569]">
                <span className="text-[#12304A] font-bold">{step.from}</span>
                <span className="text-[#087E8B] text-[10px]">──[{step.type}]──&gt;</span>
                <span className="text-[#B7791F] font-bold">{step.to}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
