import React, { useEffect, useState } from 'react';
import { useInvestigation } from '../context/InvestigationContext';
import { caseService } from '../services/caseService';
import { Case } from '../types';
import { CaseDetailsHeader } from '../components/cases/CaseDetailsHeader';
import { CaseSummaryTab } from '../components/cases/CaseSummaryTab';
import { CaseEvidenceTab } from '../components/cases/CaseEvidenceTab';
import { NetworkAnalysis } from './NetworkAnalysis';
import { EntitiesTable } from '../components/entities/EntitiesTable';
import { EntityProfileView } from '../components/entities/EntityProfileView';
import { InvestigationTimeline } from '../components/timeline/InvestigationTimeline';
import { AlertsList } from '../components/alerts/AlertsList';
import { InvestigationNotesView } from '../components/notes/InvestigationNotesView';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const CaseDetails: React.FC = () => {
  const { activeCaseId, activeCaseTab, isEntityProfileOpen, selectedEntityId, closeEntityProfile } = useInvestigation();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const c = await caseService.getCaseById(activeCaseId);
        setCaseData(c || null);
      } catch (err) {
        console.warn('Case details load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCaseId]);

  if (loading || !caseData) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto py-4">
        <LoadingSkeleton rows={4} height="h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-5 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      {/* Case Dossier Header with 8-tab switcher */}
      <CaseDetailsHeader caseData={caseData} />

      {/* Tab 1: Case Overview */}
      {(activeCaseTab === 'overview' || activeCaseTab === 'activity') && (
        <CaseSummaryTab caseData={caseData} />
      )}

      {/* Tab 2: Network Link Analysis */}
      {(activeCaseTab === 'network' || activeCaseTab === 'investigation') && (
        <NetworkAnalysis />
      )}

      {/* Tab 3: Entities Directory OR 360° Profile */}
      {activeCaseTab === 'entities' && (
        isEntityProfileOpen && selectedEntityId ? (
          <EntityProfileView 
            entityId={selectedEntityId} 
            onClose={closeEntityProfile} 
          />
        ) : (
          <EntitiesTable />
        )
      )}

      {/* Tab 4: Chronological Timeline */}
      {activeCaseTab === 'timeline' && (
        <InvestigationTimeline />
      )}

      {/* Tab 5: Investigation Alerts Queue */}
      {activeCaseTab === 'alerts' && (
        <AlertsList />
      )}

      {/* Tab 6: Source Evidence Ledger */}
      {activeCaseTab === 'evidence' && (
        <CaseEvidenceTab caseId={activeCaseId} />
      )}

      {/* Tab 7: Investigator Collaboration Notes */}
      {activeCaseTab === 'notes' && (
        <InvestigationNotesView caseId={activeCaseId} />
      )}

      {/* Tab 8: Intelligence Report Generator */}
      {activeCaseTab === 'reports' && (
        <ReportGenerator />
      )}
    </div>
  );
};
