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
import { InvestigationTimeline } from '../components/timeline/InvestigationTimeline';
import { AlertsList } from '../components/alerts/AlertsList';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { InvestigationNotesView } from '../components/notes/InvestigationNotesView';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EntityTypeBadge, PriorityBadge } from '../components/common/Badge';

export const CaseDetails: React.FC = () => {
  const { activeCaseId, activeCaseTab, selectedEntityId, setSelectedEntityId, navigateTo } = useInvestigation();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [graphData, setGraphData] = useState<NetworkGraphPayload | null>(null);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [c, g, ents] = await Promise.all([
          caseService.getCaseById(activeCaseId),
          networkService.getGraphData({ caseId: activeCaseId }),
          entityService.getEntities({ caseId: activeCaseId })
        ]);
        setCaseData(c || null);
        setGraphData(g);
        setEntities(ents);

        if (selectedEntityId) {
          const found = ents.find(e => e.id.toLowerCase() === selectedEntityId.toLowerCase());
          setSelectedEntity(found || ents[0] || null);
        } else if (ents.length > 0) {
          setSelectedEntity(ents[0]);
        }
      } catch (err) {
        console.warn('Case details load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCaseId, selectedEntityId]);

  if (loading || !caseData || !graphData) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={4} height="h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* Case Header with Status, Investigator, and 8-Tab Switcher */}
      <CaseDetailsHeader caseData={caseData} />

      {/* Tab 1: Overview */}
      {activeCaseTab === 'overview' && (
        <CaseSummaryTab caseData={caseData} />
      )}

      {/* Tab 2: Network Sub-Graph */}
      {activeCaseTab === 'network' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[640px]">
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

      {/* Tab 3: Entities Directory */}
      {activeCaseTab === 'entities' && (
        <div className="intel-card p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Entity ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Community</th>
                  <th className="p-3">Attention Score</th>
                  <th className="p-3">Betweenness</th>
                  <th className="p-3">Connections</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {entities.map(ent => (
                  <tr key={ent.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-white">{ent.id}</td>
                    <td className="p-3"><EntityTypeBadge type={ent.type} /></td>
                    <td className="p-3 text-cyan-400">{ent.community}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        (ent.attentionScore ?? 50) >= 70 ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {ent.attentionScore ?? 50} / 100
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{ent.betweennessCentrality.toFixed(2)}</td>
                    <td className="p-3 text-slate-300">{ent.connectionsCount} links</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedEntityId(ent.id);
                          navigateTo('case-details', { caseId: activeCaseId, entityId: ent.id, tab: 'network' });
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Timeline */}
      {activeCaseTab === 'timeline' && (
        <InvestigationTimeline />
      )}

      {/* Tab 5: Alerts */}
      {activeCaseTab === 'alerts' && (
        <AlertsList />
      )}

      {/* Tab 6: Evidence */}
      {activeCaseTab === 'evidence' && (
        <CaseEvidenceTab caseId={activeCaseId} />
      )}

      {/* Tab 7: Reports */}
      {activeCaseTab === 'reports' && (
        <ReportGenerator />
      )}

      {/* Tab 8: Notes & Activity */}
      {activeCaseTab === 'activity' && (
        <InvestigationNotesView caseId={activeCaseId} />
      )}
    </div>
  );
};
