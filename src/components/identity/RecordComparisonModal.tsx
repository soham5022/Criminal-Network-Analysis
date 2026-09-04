import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  GitMerge, 
  Split 
} from 'lucide-react';
import { IdentityConflict, PotentialDuplicateEntity } from '../../services/identityResolutionService';

interface RecordComparisonModalProps {
  conflict?: IdentityConflict | null;
  duplicate?: PotentialDuplicateEntity | null;
  onClose: () => void;
  onResolveConflict: (conflictId: string, decision: 'SAME_ENTITY' | 'KEEP_SEPARATE', notes: string) => void;
  onResolveDuplicate?: (duplicateId: string, decision: 'MERGE' | 'SEPARATE', notes: string) => void;
}

export const RecordComparisonModal: React.FC<RecordComparisonModalProps> = ({
  conflict,
  duplicate,
  onClose,
  onResolveConflict,
  onResolveDuplicate
}) => {
  const [notes, setNotes] = useState<string>('');

  if (!conflict && !duplicate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base text-[#12304A] tracking-tight flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-[#087E8B]" />
              <span>
                {conflict ? 'IDENTITY CONFLICT RESOLUTION REVIEW' : 'POTENTIAL DUPLICATE ENTITY COMPARISON'}
              </span>
            </h3>
            <p className="text-xs text-[#64748B] font-sans">
              Human-in-the-Loop cross-source identity correlation analysis.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* A. CONFLICT COMPARISON MODE */}
          {conflict && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-[#78350F] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#B7791F]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{conflict.title}</span>
                </div>
                <p className="text-xs text-[#475569] font-sans leading-relaxed">{conflict.inconsistencyExplanation}</p>
              </div>

              {/* Side by Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {/* Source A */}
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <span className="font-bold text-[#087E8B] text-[10px] uppercase tracking-wider">Source Record A</span>
                    <span className="text-[10px] text-[#64748B]">{conflict.sourceA.recordId}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#64748B] font-sans block">Reporting Source:</span>
                    <strong className="text-[#12304A] text-xs font-sans">{conflict.sourceA.sourceName}</strong>
                  </div>
                  <div className="space-y-1 p-2.5 rounded bg-[#FFFFFF] border border-[#CBD5E1]">
                    <span className="text-[10px] text-[#64748B] font-sans block">Recorded Value:</span>
                    <strong className="text-[#16805C] text-sm">{conflict.sourceA.value}</strong>
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    Timestamp: {conflict.sourceA.timestamp}
                  </div>
                </div>

                {/* Source B */}
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <span className="font-bold text-[#B7791F] text-[10px] uppercase tracking-wider">Source Record B</span>
                    <span className="text-[10px] text-[#64748B]">{conflict.sourceB.recordId}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#64748B] font-sans block">Reporting Source:</span>
                    <strong className="text-[#12304A] text-xs font-sans">{conflict.sourceB.sourceName}</strong>
                  </div>
                  <div className="space-y-1 p-2.5 rounded bg-[#FFFFFF] border border-[#CBD5E1]">
                    <span className="text-[10px] text-[#64748B] font-sans block">Recorded Value:</span>
                    <strong className="text-[#B7791F] text-sm">{conflict.sourceB.value}</strong>
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    Timestamp: {conflict.sourceB.timestamp}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. DUPLICATE ENTITY COMPARISON MODE */}
          {duplicate && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] text-[#087E8B] flex items-center justify-between">
                <div>
                  <div className="font-bold font-mono text-sm">Match Score: {duplicate.matchScore}% ({duplicate.matchTier})</div>
                  <p className="text-xs text-[#475569] font-sans">Correlated across synthetic telecom, corporate, and surveillance records.</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                  {duplicate.status}
                </span>
              </div>

              {/* Overlap Summary */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Correlation & Overlap Rationale:
                </span>
                <ul className="space-y-1 text-[#334155] font-sans text-xs">
                  {duplicate.whyMatchedReasons.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#087E8B] font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-[#087E8B] uppercase">Primary Entity: {duplicate.primaryEntityId}</span>
                  <div className="text-[#12304A] font-bold text-sm font-sans">Arjun Mehta</div>
                  <div className="text-[#64748B] text-[11px] space-y-1 pt-1 font-sans">
                    <div>📱 Phone: {duplicate.overlappingAttributes.phones[0]}</div>
                    <div>🏢 Org: {duplicate.overlappingAttributes.organizations[0]}</div>
                    <div>📍 Address: {duplicate.overlappingAttributes.addresses[0]}</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-[#B7791F] uppercase">Candidate Match: {duplicate.candidateEntityId}</span>
                  <div className="text-[#12304A] font-bold text-sm font-sans">{duplicate.candidateName}</div>
                  <div className="text-[#64748B] text-[11px] space-y-1 pt-1 font-sans">
                    <div>📱 Phone: {duplicate.overlappingAttributes.phones[0]} (Shared)</div>
                    <div>🏢 Org: {duplicate.overlappingAttributes.organizations[0]} (Shared)</div>
                    <div>📍 Address: {duplicate.overlappingAttributes.addresses[0]} (Shared)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rationale Input */}
          <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] block">
              Investigator Rationale & Official Note:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified via FIR witness statement; spelling error in field report confirmed..."
              className="w-full p-2.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold text-[#64748B] hover:text-[#12304A] transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {conflict && (
              <>
                <button
                  onClick={() => {
                    onResolveConflict(conflict.id, 'KEEP_SEPARATE', notes);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] text-xs font-semibold transition-colors border border-[#CBD5E1] shadow-sm"
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Keep Separate</span>
                </button>
                <button
                  onClick={() => {
                    onResolveConflict(conflict.id, 'SAME_ENTITY', notes);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Same Entity</span>
                </button>
              </>
            )}

            {duplicate && (
              <>
                <button
                  onClick={() => {
                    if (onResolveDuplicate) onResolveDuplicate(duplicate.id, 'SEPARATE', notes);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] text-xs font-semibold transition-colors border border-[#CBD5E1] shadow-sm"
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Keep Separate</span>
                </button>
                <button
                  onClick={() => {
                    if (onResolveDuplicate) onResolveDuplicate(duplicate.id, 'MERGE', notes);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>Merge into Unified Identity</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
