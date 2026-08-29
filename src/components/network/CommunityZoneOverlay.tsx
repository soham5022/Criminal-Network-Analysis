import React, { useState } from 'react';
import { CommunityInfo } from './communityLayout';
import { Layers, X } from 'lucide-react';

interface CommunityZoneOverlayProps {
  communityStats: CommunityInfo[];
  activeCommunity: string | null;
  onSelectCommunity: (commId: string | null) => void;
  isCommunityViewActive: boolean;
}

export const CommunityZoneOverlay: React.FC<CommunityZoneOverlayProps> = ({
  communityStats,
  activeCommunity,
  onSelectCommunity,
  isCommunityViewActive
}) => {
  const [hoveredComm, setHoveredComm] = useState<string | null>(null);

  const activeOrHovered = activeCommunity || hoveredComm;
  const activeStat = communityStats.find(s => s.id === activeOrHovered);

  if (communityStats.length === 0) return null;

  return (
    <>
      {/* Dynamic Spatial Region Headers / Bounding Guides */}
      <div className="absolute top-3 right-4 z-10 flex flex-wrap items-center gap-1.5 pointer-events-auto select-none max-w-md justify-end">
        {communityStats.map((comm) => {
          const isSelected = activeCommunity === comm.id || hoveredComm === comm.id;
          return (
            <div
              key={comm.id}
              className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                isSelected
                  ? `${comm.badgeBg} shadow-md`
                  : 'bg-slate-900/70 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
              onMouseEnter={() => setHoveredComm(comm.id)}
              onMouseLeave={() => setHoveredComm(null)}
              onClick={() => onSelectCommunity(activeCommunity === comm.id ? null : comm.id)}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: comm.color }} />
              <span>{comm.category || comm.id} ({comm.entityCount})</span>
            </div>
          );
        })}
      </div>

      {/* Community Detail Inspection Popup (When hovered or clicked) */}
      {activeStat && (
        <div className="absolute top-12 right-4 z-30 w-64 bg-[#0b1326]/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-1 text-xs select-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-white font-mono text-xs">{activeStat.name}</span>
            </div>
            {activeCommunity && (
              <button 
                onClick={() => onSelectCommunity(null)} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {activeStat.description}
          </p>

          <div className="space-y-1.5 pt-1 text-[11px] border-t border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-400">Entities in Cluster:</span>
              <span className="font-mono text-white font-bold">{activeStat.entityCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Internal & Cross Links:</span>
              <span className="font-mono text-white font-bold">{activeStat.relationshipCount}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Dominant Bridge:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {activeStat.keyBridge || 'Primary Node'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
