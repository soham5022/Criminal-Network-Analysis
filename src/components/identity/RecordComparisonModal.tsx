import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  GitMerge, 
  Split, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2 
} from 'lucide-react';
import { IdentityConflict, PotentialDuplicateEntity } from '../../services/identityResolutionService';

interface RecordComparisonModalProps {
  conflict?: IdentityConflict | null;
  duplicate?: PotentialDuplicateEntity | null;
  onClose: () => void;
  onResolveConflict: (conflictId: string, decision: 'SAME_ENTITY' | 'KEEP_SEPARATE', notes: string) => void;
  onResolveDuplicate: (duplicateId: string, decision: 'MERGE' | 'SEPARATE', notes: string) => void;
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-3xl intel-card rounded-2xl border border-slate-700 bg-[#090f1e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>
                {conflict ? 'IDENTITY CONFLICT RESOLUTION REVIEW' : 'POTENTIAL DUPLICATE ENTITY COMPARISON'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Human-in-the-Loop cross-source identity correlation analysis.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* A. CONFLICT COMPARISON MODE */}
          {conflict && (
            <div className="space-y-5">
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{conflict.title}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans">{conflict.inconsistencyExplanation}</p>
              </div>

              {/* Side by Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {/* Source A */}
                <div className="p-4 rounded-xl bg-[#090e1a] border border-blue-500/30 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-blue-400 text-[10px] uppercase tracking-wider">Source Record A</span>
                    <span className="text-[10px] text-slate-400">{conflict.sourceA.recordId}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-sans block">Reporting Source:</span>
                    <strong className="text-white text-xs">{conflict.sourceA.sourceName}</strong>
                  </div>
                  <div className="space-y-1 p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-sans block">Recorded Value:</span>
                    <strong className="text-emerald-400 text-sm">{conflict.sourceA.value}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Timestamp: {conflict.sourceA.timestamp}
                  </div>
                </div>

                {/* Source B */}
                <div className="p-4 rounded-xl bg-[#090e1a] border border-amber-500/30 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-400 text-[10px] uppercase tracking-wider">Source Record B</span>
                    <span className="text-[10px] text-slate-400">{conflict.sourceB.recordId}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-sans block">Reporting Source:</span>
                    <strong className="text-white text-xs">{conflict.sourceB.sourceName}</strong>
                  </div>
                  <div className="space-y-1 p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 font-sans block">Recorded Value:</span>
                    <strong className="text-amber-300 text-sm">{conflict.sourceB.value}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Timestamp: {conflict.sourceB.timestamp}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* B. DUPLICATE ENTITY COMPARISON MODE */}
          {duplicate && (
            <div className="space-y-5">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 flex items-center justify-between">
                <div>
                  <div className="font-bold font-mono">Match Score: {duplicate.matchScore}% ({duplicate.matchTier})</div>
                  <p className="text-[11px] text-slate-300 font-sans">Correlated across synthetic telecom, corporate, and surveillance records.</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {duplicate.status}
                </span>
              </div>

              {/* Overlap Summary */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Correlation & Overlap Rationale:
                </span>
                <ul className="space-y-1 text-slate-300 font-sans text-xs">
                  {duplicate.whyMatchedReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase">Primary Entity: {duplicate.primaryEntityId}</span>
                  <div className="text-white font-bold text-sm">Arjun Mehta</div>
                  <div className="text-slate-400 text-[11px] space-y-1 pt-1 font-sans">
                    <div>📱 Phone: {duplicate.overlappingAttributes.phones[0]}</div>
                    <div>🏢 Org: {duplicate.overlappingAttributes.organizations[0]}</div>
                    <div>📍 Address: {duplicate.overlappingAttributes.addresses[0]}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">Candidate Match: {duplicate.candidateEntityId}</span>
                  <div className="text-white font-bold text-sm">{duplicate.candidateName}</div>
                  <div className="text-slate-400 text-[11px] space-y-1 pt-1 font-sans">
                    <div>📱 Phone: {duplicate.overlappingAttributes.phones[0]} (Shared)</div>
                    <div>🏢 Org: {duplicate.overlappingAttributes.organizations[0]} (Shared)</div>
                    <div>📍 Address: {duplicate.overlappingAttributes.addresses[0]} (Shared)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rationale Input */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Investigator Rationale & Official Note:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified via FIR witness statement; spelling error in field report confirmed..."
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
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
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Keep Separate</span>
                </button>
                <button
                  onClick={() => {
                    onResolveConflict(conflict.id, 'SAME_ENTITY', notes);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
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
                    onResolveDuplicate(duplicate.id, 'SEPARATE', notes);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Keep Separate</span>
                </button>
                <button
                  onClick={() => {
                    onResolveDuplicate(duplicate.id, 'MERGE', notes);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
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
