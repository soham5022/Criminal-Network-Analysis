import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  GitMerge, 
  Split, 
  Eye, 
  Info, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  Check,
  X,
  FileText
} from 'lucide-react';
import { identityResolutionService, IdentityMatchCandidate } from '../../services/identityResolutionService';
import { useInvestigation } from '../../context/InvestigationContext';

export const IdentityResolutionView: React.FC = () => {
  const { navigateTo, openEntityProfile, setActiveCaseId } = useInvestigation();
  const [candidates, setCandidates] = useState<IdentityMatchCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<IdentityMatchCandidate | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [investigatorNote, setInvestigatorNote] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const loadData = () => {
    setCandidates(identityResolutionService.getCandidates());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReview = (candidate: IdentityMatchCandidate) => {
    setSelectedCandidate(candidate);
    setInvestigatorNote(candidate.notes || '');
    setReviewModalOpen(true);
  };

  const handleConfirmMerge = (candidateId: string) => {
    const res = identityResolutionService.confirmMatch(
      candidateId, 
      'Inspector Rajesh Verma', 
      investigatorNote || 'Verified entity commonality through telecommunication and vehicle records.'
    );
    if (res) {
      setActionSuccessMsg(`Confirmed: ${res.sourceEntityLabel} and ${res.targetEntityLabel} marked as confirmed same entity.`);
      loadData();
      setReviewModalOpen(false);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleKeepSeparate = (candidateId: string) => {
    const res = identityResolutionService.keepSeparate(
      candidateId, 
      'Inspector Rajesh Verma', 
      investigatorNote || 'Maintained as separate entities based on independent source records and physical verification.'
    );
    if (res) {
      setActionSuccessMsg(`Updated: ${res.sourceEntityLabel} and ${res.targetEntityLabel} retained as distinct separate entities.`);
      loadData();
      setReviewModalOpen(false);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in select-none">
      
      {/* Informational Header */}
      <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#087E8B] font-bold mb-1">
            <GitMerge className="w-4 h-4 text-[#087E8B]" />
            <span>ALGORITHMIC IDENTITY RESOLUTION & CONFLICT DETECTION</span>
          </div>
          <h2 className="text-lg font-bold text-[#12304A]">
            Potential Identity Matches & Cross-Record Conflicts
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5 max-w-2xl">
            TraceNet identifies probabilistic entity overlaps across disparate FIRs, CDRs, and banking ledgers. 
            Entities are <strong className="text-[#12304A]">never automatically merged</strong> without explicit officer confirmation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-[#B7791F] text-xs font-semibold flex items-center gap-2 shadow-sm">
            <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
            <span>{candidates.filter(c => c.status === 'PENDING_REVIEW').length} Pending Officer Review</span>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-lg bg-[#E8F7F0] border border-[#A3E0C8] text-[#16805C] text-xs font-semibold flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16805C]" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-[#16805C] hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Candidate List */}
      <div className="grid grid-cols-1 gap-4">
        {candidates.map((cand) => {
          const isPending = cand.status === 'PENDING_REVIEW';
          const isMerged = cand.status === 'CONFIRMED_MERGED';
          const isSeparate = cand.status === 'KEPT_SEPARATE';

          return (
            <div 
              key={cand.id} 
              className={`p-5 rounded-lg border bg-[#FFFFFF] shadow-sm transition-all ${
                isPending ? 'border-[#CBD5E1] hover:border-[#087E8B]' : 'border-[#E2E8F0] opacity-90'
              }`}
            >
              {/* Top Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold text-[#64748B]">{cand.id}</span>
                  <div className="h-3 w-px bg-[#CBD5E1]" />
                  <span className="text-xs font-bold text-[#12304A]">
                    Potential Identity Match
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                    {cand.confidenceScore}% Confidence
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                      Action Required
                    </span>
                  )}
                  {isMerged && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Confirmed Same Entity
                    </span>
                  )}
                  {isSeparate && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Kept Separate
                    </span>
                  )}
                </div>
              </div>

              {/* Side-by-Side Entity Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {/* Source Record */}
                <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      RECORD A ({cand.sourceCaseId})
                    </span>
                    <button
                      onClick={() => {
                        setActiveCaseId(cand.sourceCaseId);
                        openEntityProfile(cand.sourceEntityId);
                      }}
                      className="text-[11px] font-semibold text-[#087E8B] hover:underline flex items-center gap-1"
                    >
                      <span>View Entity</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#12304A]">{cand.sourceEntityLabel}</h3>
                    <p className="text-xs font-mono text-[#64748B]">{cand.sourceEntityId} • {cand.sourceEntityType}</p>
                  </div>
                  <div className="text-xs text-[#475569] space-y-1">
                    <p><strong className="text-[#12304A]">Jurisdiction:</strong> {cand.sourceLocation}</p>
                    <p><strong className="text-[#12304A]">Intel Note:</strong> {cand.sourceDetails}</p>
                  </div>
                </div>

                {/* Target Record */}
                <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                      RECORD B ({cand.targetCaseId})
                    </span>
                    <button
                      onClick={() => {
                        setActiveCaseId(cand.targetCaseId);
                        openEntityProfile(cand.targetEntityId);
                      }}
                      className="text-[11px] font-semibold text-[#087E8B] hover:underline flex items-center gap-1"
                    >
                      <span>View Entity</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#12304A]">{cand.targetEntityLabel}</h3>
                    <p className="text-xs font-mono text-[#64748B]">{cand.targetEntityId} • {cand.targetEntityType}</p>
                  </div>
                  <div className="text-xs text-[#475569] space-y-1">
                    <p><strong className="text-[#12304A]">Jurisdiction:</strong> {cand.targetLocation}</p>
                    <p><strong className="text-[#12304A]">Intel Note:</strong> {cand.targetDetails}</p>
                  </div>
                </div>
              </div>

              {/* Matching Indicators & Conflicts Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
                {/* Indicators */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16805C] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Matching Indicators
                  </span>
                  <div className="space-y-1">
                    {cand.matchingIndicators.map((ind, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[#2E7D32] bg-[#E8F7F0]/60 p-2 rounded border border-[#A3E0C8]/50">
                        <span className="font-bold shrink-0">✓ {ind.indicator}:</span>
                        <span className="text-[#12304A]">{ind.details}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conflicts */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C24141] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Possible Conflicts / Discrepancies
                  </span>
                  <div className="space-y-1">
                    {cand.conflicts.map((conf, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[#C24141] bg-[#FEE2E2]/60 p-2 rounded border border-[#FCA5A5]/50">
                        <span className="font-bold shrink-0">⚠ Warning:</span>
                        <span className="text-[#12304A]">{conf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-[#64748B]">
                  {cand.reviewedAt ? (
                    <span>Reviewed by {cand.reviewedBy} on {cand.reviewedAt}</span>
                  ) : (
                    <span>Awaiting supervisory validation before graph consolidation.</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview(cand)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#12304A] shadow-sm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Review Match</span>
                  </button>

                  {isPending && (
                    <>
                      <button
                        onClick={() => handleConfirmMerge(cand.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#16805C] hover:bg-[#126649] text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Confirm Same Entity</span>
                      </button>

                      <button
                        onClick={() => handleKeepSeparate(cand.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#FEE2E2] border border-[#CBD5E1] hover:border-[#FCA5A5] text-[#C24141] text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Split className="w-3.5 h-3.5" />
                        <span>Keep Separate</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal Dialog */}
      {reviewModalOpen && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="w-full max-w-xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#12304A]">
                  Identity Resolution Review — {selectedCandidate.id}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Case {selectedCandidate.sourceCaseId} ↔ Case {selectedCandidate.targetCaseId}
                </p>
              </div>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="text-[#64748B] hover:text-[#12304A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#E6F4F5] border border-[#A7DFE3] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#087E8B] block">Probabilistic Algorithm Confidence:</span>
                  <span className="text-[11px] text-[#12304A]">Evaluated against phone IMEI, ANPR checkpoints, and banking relay topology.</span>
                </div>
                <span className="text-xl font-mono font-bold text-[#087E8B]">{selectedCandidate.confidenceScore}%</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#12304A] uppercase tracking-wider block">
                  Investigator Review Note / Jurisdictional Justification:
                </label>
                <textarea
                  rows={3}
                  value={investigatorNote}
                  onChange={(e) => setInvestigatorNote(e.target.value)}
                  placeholder="State evidence cross-references supporting this determination..."
                  className="w-full p-2.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-end gap-2.5">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#64748B]"
              >
                Close
              </button>

              <button
                onClick={() => handleKeepSeparate(selectedCandidate.id)}
                className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141] text-xs font-semibold"
              >
                Keep Entities Separate
              </button>

              <button
                onClick={() => handleConfirmMerge(selectedCandidate.id)}
                className="px-4 py-2 rounded-md bg-[#16805C] hover:bg-[#126649] text-white text-xs font-semibold shadow-sm"
              >
                Confirm Same Entity & Update Graph
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
