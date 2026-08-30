import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Info
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
      <div className="p-3.5 rounded-lg bg-[#E6F4F5] border border-[#A7DFE3] flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-[#087E8B] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-[#12304A]">Unified Cross-Source Resolution Protocol (Human-in-the-Loop):</strong>
          <p className="text-[#475569] font-sans leading-relaxed">
            Information correlated across authorized connected synthetic sources (Identity KYC, Telecom CDR, Banking Ledger, ANPR Checkpoints, FIR Records, Corporate Registry). Automated heuristics suggest links; final correlation requires investigator authorization.
          </p>
        </div>
      </div>

      {/* 2. Resolution Status Header Card */}
      <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16805C]" />
            <span>CROSS-RECORD IDENTITY RESOLUTION STATUS</span>
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#12304A]">{dossier.primaryLegalName}</h3>
            <span className="text-xs text-[#64748B] font-mono">({entityId})</span>
          </div>
          <p className="text-xs text-[#64748B] font-sans">
            Cross-referenced across <strong className="text-[#12304A]">{dossier.sourceRecords.length} authorized source records</strong> and <strong className="text-[#12304A]">{dossier.aliases.length} recorded aliases</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-right">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Resolution Score</div>
            <div className="text-base font-mono font-bold text-[#16805C]">{dossier.resolutionScore} / 100</div>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-right">
            <div className="text-[10px] uppercase font-bold text-[#64748B]">Review Queue</div>
            <div className="text-base font-mono font-bold text-[#B7791F]">{pendingConflictsCount + pendingDuplicatesCount} Pending</div>
          </div>
        </div>
      </div>

      {/* 3. Source Records Grid */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#12304A] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#087E8B]" />
            <span>Connected Source Systems ({dossier.sourceRecords.length})</span>
          </h4>
          <span className="text-[10px] text-[#64748B]">Synthetic Authorized Data Sources</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dossier.sourceRecords.map((src) => (
            <div key={src.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#12304A]">{src.sourceName}</span>
                <span className="text-[10px] font-mono text-[#64748B]">{src.lastSeen}</span>
              </div>
              <p className="text-xs text-[#475569]">{src.attributeLabel}: <strong className="text-[#12304A]">{src.attributeValue}</strong></p>
              <div className="text-[10px] font-mono text-[#087E8B]">Ref ID: {src.recordId}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Modal */}
      {selectedConflict && (
        <RecordComparisonModal
          conflict={selectedConflict}
          onClose={() => setSelectedConflict(null)}
          onResolveConflict={handleResolveConflict}
        />
      )}

      {/* Duplicate Modal */}
      {selectedDuplicate && (
        <RecordComparisonModal
          duplicate={selectedDuplicate}
          onClose={() => setSelectedDuplicate(null)}
          onResolveConflict={handleResolveConflict}
          onResolveDuplicate={handleResolveDuplicate}
        />
      )}
    </div>
  );
};
