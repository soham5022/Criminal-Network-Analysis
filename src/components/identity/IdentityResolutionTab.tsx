import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  GitMerge, 
  Split, 
  Lock, 
  ExternalLink, 
  FileSpreadsheet, 
  Database, 
  Building2, 
  Phone, 
  CreditCard, 
  Truck, 
  MapPin, 
  Info,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  identityResolutionService, 
  UnifiedIdentityDossier, 
  IdentityConflict, 
  PotentialDuplicateEntity 
} from '../../services/identityResolutionService';
import { RecordComparisonModal } from './RecordComparisonModal';

interface IdentityResolutionTabProps {
  entityId: string;
  caseId: string;
}

export const IdentityResolutionTab: React.FC<IdentityResolutionTabProps> = ({ entityId, caseId }) => {
  const [dossier, setDossier] = useState<UnifiedIdentityDossier | null>(null);
  const [selectedConflict, setSelectedConflict] = useState<IdentityConflict | null>(null);
  const [selectedDuplicate, setSelectedDuplicate] = useState<PotentialDuplicateEntity | null>(null);

  const loadData = () => {
    const data = identityResolutionService.getIdentityResolutionData(entityId, caseId);
    setDossier(data);
  };

  useEffect(() => {
    loadData();
  }, [entityId, caseId]);

  if (!dossier) return null;

  const handleResolveConflict = (conflictId: string, decision: 'SAME_ENTITY' | 'KEEP_SEPARATE', notes: string) => {
    identityResolutionService.resolveConflict(conflictId, decision, notes);
    loadData();
  };

  const handleResolveDuplicate = (duplicateId: string, decision: 'MERGE' | 'SEPARATE', notes: string) => {
    identityResolutionService.resolveDuplicateCandidate(duplicateId, decision, notes);
    loadData();
  };

  const pendingConflictsCount = dossier.conflicts.filter(c => c.status === 'REQUIRES_INVESTIGATOR_REVIEW').length;
  const pendingDuplicatesCount = dossier.potentialDuplicates.filter(d => d.status === 'PENDING_REVIEW').length;

  return (
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl">
      
      {/* 1. Official Data Governance Disclaimer */}
      <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-white">Unified Cross-Source Resolution Protocol (Human-in-the-Loop):</strong>
          <p className="text-slate-300 font-sans leading-relaxed">
            Information correlated across authorized connected synthetic sources (Identity KYC, Telecom CDR, Banking Ledger, ANPR Checkpoints, FIR Records, Corporate Registry). Automated heuristics suggest links; final correlation requires investigator authorization.
          </p>
        </div>
      </div>

      {/* 2. Resolution Status Header Card */}
      <div className="intel-card p-5 border border-slate-800 bg-[#090f1e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>CROSS-RECORD IDENTITY RESOLUTION STATUS</span>
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white font-mono">{dossier.primaryLegalName}</h3>
            <span className="text-xs text-slate-400 font-mono">({entityId})</span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Cross-referenced across <strong className="text-slate-200">{dossier.sourceRecords.length} authorized source records</strong> and <strong className="text-slate-200">{dossier.aliases.length} recorded aliases</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#060a14] border border-slate-800 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Resolution Score</div>
            <div className="text-base font-mono font-bold text-emerald-400">{dossier.resolutionScore} / 100</div>
          </div>

          <div className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border ${
            pendingConflictsCount > 0 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}>
            {pendingConflictsCount > 0 ? `${pendingConflictsCount} CONFLICTS PENDING` : 'UNIFIED CONFIRMED'}
          </div>
        </div>
      </div>

      {/* 3. Active Identity Inconsistencies & Conflicts */}
      {dossier.conflicts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Active Identity Inconsistencies & Conflicts ({dossier.conflicts.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">Requires officer review before automatic unification</span>
          </div>

          <div className="space-y-3">
            {dossier.conflicts.map((conflict) => {
              const isResolved = conflict.status !== 'REQUIRES_INVESTIGATOR_REVIEW';

              return (
                <div 
                  key={conflict.id}
                  className="intel-card p-5 border border-slate-800 bg-[#0d1527] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{conflict.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isResolved 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {conflict.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        {conflict.inconsistencyExplanation}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedConflict(conflict)}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm flex items-center gap-1.5"
                    >
                      <span>{isResolved ? 'Review Decision' : 'Compare Records'}</span>
                    </button>
                  </div>

                  {/* Quick Side-by-side snippet */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-blue-400 block font-sans">{conflict.sourceA.sourceName} ({conflict.sourceA.recordId})</span>
                      <strong className="text-white">{conflict.sourceA.value}</strong>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-amber-400 block font-sans">{conflict.sourceB.sourceName} ({conflict.sourceB.recordId})</span>
                      <strong className="text-amber-300">{conflict.sourceB.value}</strong>
                    </div>
                  </div>

                  {conflict.resolutionNotes && (
                    <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800/80 pt-2">
                      <strong>Resolution Note ({conflict.resolvedBy}):</strong> {conflict.resolutionNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Potential Duplicate Entities Review */}
      {dossier.potentialDuplicates.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <GitMerge className="w-4 h-4" />
              <span>Potential Duplicate Entity Correlations ({dossier.potentialDuplicates.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">Deterministic & probabilistic overlap detection</span>
          </div>

          <div className="space-y-3">
            {dossier.potentialDuplicates.map((dup) => (
              <div 
                key={dup.id}
                className="intel-card p-5 border border-slate-800 bg-[#090f1e] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 font-mono font-bold text-white text-xs">
                      <span>{entityId}</span>
                      <span className="text-blue-400">⟷</span>
                      <span className="text-amber-300">{dup.candidateEntityId} ({dup.candidateName})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {dup.matchScore}% Match ({dup.matchTier})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Overlap detected across shared phone, address, and corporate records.
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDuplicate(dup)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm"
                  >
                    <span>{dup.status === 'PENDING_REVIEW' ? 'Review & Compare' : 'Review Decision'}</span>
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-300 font-sans">
                  {dup.whyMatchedReasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {dup.resolutionNotes && (
                  <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800/80 pt-2">
                    <strong>Resolution Note ({dup.resolvedBy}):</strong> {dup.resolutionNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Source Record Cross-Reference Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Cross-Source Record Provenance Ledger ({dossier.sourceRecords.length} Attributes)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Cryptographically tracked provenance</span>
        </div>

        <div className="intel-card border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono font-semibold">
                <tr>
                  <th className="py-3 px-4">Attribute</th>
                  <th className="py-3 px-4">Masked Value</th>
                  <th className="py-3 px-4">Reporting Source</th>
                  <th className="py-3 px-4">Source Record ID</th>
                  <th className="py-3 px-4">First Observed</th>
                  <th className="py-3 px-4">Last Observed</th>
                  <th className="py-3 px-4 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {dossier.sourceRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-4 text-white font-bold whitespace-nowrap">
                      {rec.attributeLabel}
                    </td>
                    <td className="py-3 px-4 text-blue-300 whitespace-nowrap">
                      {rec.maskedValue}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-sans text-xs">
                      {rec.sourceName}
                    </td>
                    <td className="py-3 px-4 text-amber-400 whitespace-nowrap">
                      {rec.recordId}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {rec.firstSeen}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {rec.lastSeen}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {rec.verificationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Primary Identity vs. Reported Aliases Matrix */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Primary Identity vs. Reported Aliases Matrix</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dossier.aliases.map((al) => (
            <div key={al.id} className="intel-card p-4 border border-slate-800 bg-[#090f1e] space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-white font-mono text-sm">{al.aliasName}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {al.aliasType.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">{al.notes}</p>
              <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/80 flex justify-between">
                <span>Source: {al.sourceRecordId}</span>
                <span>{al.verificationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Identity Evolution Timeline */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>Cross-Source Identity Evolution Timeline</span>
        </h3>

        <div className="space-y-2">
          {dossier.evolutionTimeline.map((step) => (
            <div key={step.id} className="p-3.5 rounded-xl bg-[#090e1a] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="px-2 py-1 rounded bg-slate-900 font-mono font-bold text-purple-300 border border-slate-800">
                  {step.year}
                </div>
                <div className="space-y-0.5">
                  <div className="font-bold text-white font-mono">{step.summary}</div>
                  <div className="text-[11px] text-slate-400 font-sans">{step.details}</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono text-right shrink-0">
                <div>Source: <span className="text-slate-300">{step.sourceName}</span></div>
                <div className="text-blue-400">{step.recordId} • {step.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      {(selectedConflict || selectedDuplicate) && (
        <RecordComparisonModal
          conflict={selectedConflict}
          duplicate={selectedDuplicate}
          onClose={() => {
            setSelectedConflict(null);
            setSelectedDuplicate(null);
          }}
          onResolveConflict={handleResolveConflict}
          onResolveDuplicate={handleResolveDuplicate}
        />
      )}

    </div>
  );
};
