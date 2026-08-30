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
  onSelectCommunity
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
                  ? `${comm.badgeBg} shadow-sm`
                  : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#64748B] hover:text-[#12304A] hover:bg-[#F8FAFC]'
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
        <div className="absolute top-12 right-4 z-30 w-64 bg-[#FFFFFF] border border-[#CBD5E1] rounded-lg p-3.5 shadow-xl space-y-2.5 animate-in fade-in slide-in-from-top-1 text-xs select-none">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#087E8B]" />
              <span className="font-bold text-[#12304A] font-mono text-xs">{activeStat.name}</span>
            </div>
            {activeCommunity && (
              <button 
                onClick={() => onSelectCommunity(null)} 
                className="text-[#64748B] hover:text-[#12304A]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#475569] leading-relaxed">
            {activeStat.description}
          </p>

          <div className="space-y-1.5 pt-1 text-[11px] border-t border-[#E2E8F0]">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Entities in Cluster:</span>
              <span className="font-mono text-[#12304A] font-bold">{activeStat.entityCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Internal & Cross Links:</span>
              <span className="font-mono text-[#12304A] font-bold">{activeStat.relationshipCount}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-[#E2E8F0]">
              <span className="text-[#64748B]">Dominant Bridge:</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                {activeStat.keyBridge || 'Primary Node'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
