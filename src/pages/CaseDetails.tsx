import React, { useEffect, useState } from 'react';
import { useInvestigation } from '../context/InvestigationContext';
import { caseService } from '../services/caseService';
import { networkService, NetworkGraphPayload } from '../services/networkService';
import { entityService } from '../services/entityService';
import { Case, Entity } from '../types';
import { CaseDetailsHeader } from '../components/cases/CaseDetailsHeader';
import { CaseSummaryTab } from '../components/cases/CaseSummaryTab';
import { CaseEvidenceTab } from '../components/cases/CaseEvidenceTab';
import { CytoscapeGraph } from '../components/network/CytoscapeGraph';
import { EntityIntelligencePanel } from '../components/network/EntityIntelligencePanel';
import { AlertsList } from '../components/alerts/AlertsList';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const CaseDetails: React.FC = () => {
  const { activeCaseId, activeCaseTab, selectedEntityId, setSelectedEntityId } = useInvestigation();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [graphData, setGraphData] = useState<NetworkGraphPayload | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [c, g] = await Promise.all([
          caseService.getCaseById(activeCaseId),
          networkService.getGraphData({ caseId: activeCaseId })
        ]);
        setCaseData(c || null);
        setGraphData(g);
      } catch (err) {
        console.warn('Case details load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCaseId]);

  useEffect(() => {
    if (selectedEntityId) {
      entityService.getEntityById(selectedEntityId)
        .then(ent => setSelectedEntity(ent || null))
        .catch(() => setSelectedEntity(null));
    } else {
      setSelectedEntity(null);
    }
  }, [selectedEntityId]);

  if (loading || !caseData || !graphData) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={4} height="h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* 1. Simplified Case Header */}
      <CaseDetailsHeader caseData={caseData} />

      {/* Tab 1: Case Overview */}
      {(activeCaseTab === 'overview' || activeCaseTab === 'activity') && (
        <CaseSummaryTab caseData={caseData} />
      )}

      {/* Tab 2: Investigation & Graph Workspace */}
      {(activeCaseTab === 'investigation' || activeCaseTab === 'network' || activeCaseTab === 'entities') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[640px]">
          <div className="lg:col-span-8 h-full">
            <CytoscapeGraph
              graphData={graphData}
              selectedEntityId={selectedEntityId}
              onSelectEntity={(id) => setSelectedEntityId(id)}
            />
          </div>
          <div className="lg:col-span-4 h-full">
            <EntityIntelligencePanel
              entity={selectedEntity}
              onClose={() => setSelectedEntityId(null)}
              onSelectEntity={(id) => setSelectedEntityId(id)}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Alerts */}
      {activeCaseTab === 'alerts' && (
        <AlertsList />
      )}

      {/* Tab 4: Source Evidence */}
      {(activeCaseTab === 'evidence' || activeCaseTab === 'timeline') && (
        <CaseEvidenceTab caseId={activeCaseId} />
      )}

      {/* Tab 5: Report Generator */}
      {activeCaseTab === 'reports' && (
        <ReportGenerator />
      )}
    </div>
  );
};
