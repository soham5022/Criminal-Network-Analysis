import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface GraphReferencePopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GraphReferencePopover: React.FC<GraphReferencePopoverProps> = ({
  isOpen,
  onClose
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute top-14 left-4 z-40 w-72 bg-[#FFFFFF] border border-[#D9E0DC] rounded-md shadow-lg p-3.5 space-y-3.5 text-xs text-[#252A27] select-none animate-in fade-in slide-in-from-top-1"
    >
      {/* Header bar without educational title */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#D9E0DC]">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#234236]">
          GRAPH REFERENCE
        </span>
        <button
          onClick={onClose}
          className="text-[#66736C] hover:text-[#252A27] p-0.5 rounded transition-colors"
          title="Close reference"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SECTION 1: ENTITY TYPES */}
      <div className="space-y-2">
        <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#66736C]">
          ENTITY TYPES
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {/* Person */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
              <circle cx="7" cy="7" r="6" fill="#12304A" stroke="#234E70" strokeWidth="1" />
            </svg>
            <span className="font-medium text-[#252A27]">Person</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
              <rect x="1" y="2" width="12" height="10" rx="2.5" fill="#087E8B" stroke="#06636E" strokeWidth="1" />
            </svg>
            <span className="font-medium text-[#252A27]">Phone</span>
          </div>

          {/* Account */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
              <polygon points="7,1 12.5,4 12.5,10 7,13 1.5,10 1.5,4" fill="#2563A6" stroke="#1D4ED8" strokeWidth="1" />
            </svg>
            <span className="font-medium text-[#252A27]">Account</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
              <rect x="2" y="2" width="10" height="10" fill="#7E22CE" stroke="#6B21A8" strokeWidth="1" />
            </svg>
            <span className="font-medium text-[#252A27]">Location</span>
          </div>

          {/* Organization */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
              <polygon points="7,1 13,7 7,13 1,7" fill="#234E70" stroke="#12304A" strokeWidth="1" />
            </svg>
            <span className="font-medium text-[#252A27]">Organization</span>
          </div>

          {/* Vehicle */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
              <polygon points="7,1.5 12.5,7 7,12.5 1.5,7" fill="#B7791F" stroke="#92400E" strokeWidth="1" strokeLinejoin="round" />
            </svg>
            <span className="font-medium text-[#252A27]">Vehicle</span>
          </div>

          {/* Event */}
          <div className="flex items-center gap-2 p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] col-span-2">
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
              <polygon points="7,0 8.8,4.5 13.5,4.5 9.5,7.8 11,12.5 7,9.5 3,12.5 4.5,7.8 0.5,4.5 5.2,4.5" fill="#C24141" stroke="#991B1B" strokeWidth="0.8" />
            </svg>
            <span className="font-medium text-[#252A27]">Event (Incident / Staging / Meeting)</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: RELATIONSHIP LINE CONVENTIONS */}
      <div className="space-y-2 pt-1 border-t border-[#D9E0DC]">
        <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#66736C]">
          LINE CONVENTIONS
        </div>

        <div className="space-y-1.5 text-[11px]">
          {/* Solid line = recorded relationship */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <svg width="24" height="6" className="shrink-0">
                <line x1="0" y1="3" x2="24" y2="3" stroke="#234E70" strokeWidth="2.5" />
              </svg>
              <span className="font-semibold text-[#12304A]">Solid line</span>
            </div>
            <span className="text-[10px] text-[#66736C]">Recorded relationship</span>
          </div>

          {/* Dashed line = inferred/analytical relationship */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <svg width="24" height="6" className="shrink-0">
                <line x1="0" y1="3" x2="24" y2="3" stroke="#087E8B" strokeWidth="2" strokeDasharray="4 3" />
              </svg>
              <span className="font-semibold text-[#12304A]">Dashed line</span>
            </div>
            <span className="text-[10px] text-[#66736C]">Inferred / analytical lead</span>
          </div>

          {/* Highlighted line = selected investigation path */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <svg width="24" height="6" className="shrink-0">
                <line x1="0" y1="3" x2="24" y2="3" stroke="#087E8B" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
              <span className="font-semibold text-[#12304A]">Highlighted line</span>
            </div>
            <span className="text-[10px] text-[#66736C]">Selected path</span>
          </div>

          {/* Alert-highlighted line = relationship involved in alert */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <svg width="24" height="6" className="shrink-0">
                <line x1="0" y1="3" x2="24" y2="3" stroke="#C24141" strokeWidth="3" />
              </svg>
              <span className="font-semibold text-[#C24141]">Alert line</span>
            </div>
            <span className="text-[10px] text-[#66736C]">Involved in alert pattern</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: STATUS INDICATORS */}
      <div className="space-y-2 pt-1 border-t border-[#D9E0DC]">
        <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#66736C]">
          NODE STATUS
        </div>

        <div className="space-y-1.5 text-[11px]">
          {/* Selected */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#087E8B] bg-[#E6F4F5] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#087E8B]" />
              </div>
              <span className="font-semibold text-[#12304A]">Selected</span>
            </div>
            <span className="text-[10px] text-[#66736C]">Active inspection node</span>
          </div>

          {/* Bridge */}
          <div className="flex items-center justify-between p-1.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#B7791F] bg-[#FEF3C7] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B7791F]" />
              </div>
              <span className="font-semibold text-[#12304A]">Bridge Node</span>
            </div>
            <span className="text-[10px] text-[#66736C]">Connects distinct groups</span>
          </div>
        </div>
      </div>
    </div>
  );
};
