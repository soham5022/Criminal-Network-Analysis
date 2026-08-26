import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Info,
  Network,
  Sparkles,
  ChevronDown,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { Alert, AlertStatus } from '../../types';
import { alertService } from '../../services/alertService';
import { PriorityBadge, StatusBadge, EntityTypeBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

export const AlertsList: React.FC = () => {
  const { navigateTo, setSelectedEntityId, selectedAlertId, setActiveCaseTab } = useInvestigation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await alertService.getAlerts({ caseId: 'CASE-1024' });
      setAlerts(data);
      if (data.length > 0) {
        const found = selectedAlertId ? data.find(a => a.id === selectedAlertId) : data[0];
        setActiveAlert(found || data[0]);
      }
    } catch (err) {
      console.warn('Alerts fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleStatusChange = async (alertId: string, newStatus: AlertStatus) => {
    try {
      const updated = await alertService.updateAlertStatus(alertId, newStatus);
      setAlerts(prev => prev.map(a => a.id === alertId ? updated : a));
      if (activeAlert?.id === alertId) {
        setActiveAlert(updated);
      }
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  const filtered = alerts.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const handleInvestigateInNetwork = (entityId: string) => {
    setSelectedEntityId(entityId);
    navigateTo('investigate', { entityId });
  };

  return (
    <div className="space-y-4 select-none animate-in fade-in">
      {/* 1. Header & Quick Status Filter Bar */}
      <div className="intel-card p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Alerts & Emerging Patterns ({filtered.length} Items)
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              statusFilter === 'ALL' ? 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-semibold' : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setStatusFilter('NEW')}
            className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              statusFilter === 'NEW' ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-semibold' : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Needs Review ({alerts.filter(a => a.status === 'NEW').length})
          </button>
          <button
            onClick={() => setStatusFilter('INVESTIGATING')}
            className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              statusFilter === 'INVESTIGATING' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold' : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Investigating ({alerts.filter(a => a.status === 'INVESTIGATING').length})
          </button>
          <button
            onClick={() => setStatusFilter('REVIEWED')}
            className={`px-3 py-1.5 rounded-lg border text-xs transition-colors ${
              statusFilter === 'REVIEWED' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold' : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Reviewed ({alerts.filter(a => a.status === 'REVIEWED').length})
          </button>
        </div>
      </div>

      {/* 2. Two Column Triage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Alerts Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[72vh] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Fetching active investigative anomaly alerts...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 intel-card border border-slate-800">
              No alerts found under selected filter.
            </div>
          ) : (
            filtered.map((alert) => {
              const isSelected = activeAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setActiveAlert(alert)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 shadow-md'
                      : 'bg-[#0c1322] hover:bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400">{alert.id}</span>
                      <PriorityBadge priority={alert.severity} size="sm" />
                    </div>
                    <StatusBadge status={alert.status} size="sm" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{alert.title}</h4>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {alert.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>{alert.category}</span>
                    <span>{alert.timestamp.split('(')[0]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Alert Detail & Review Actions (7 Cols) */}
        <div className="lg:col-span-7">
          {activeAlert ? (
            <div className="intel-card p-6 border border-slate-800 space-y-5">
              
              {/* Alert Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {activeAlert.title}
                    </h3>
                    <PriorityBadge priority={activeAlert.severity} />
                  </div>
                  <p className="text-xs text-slate-400">
                    Alert ID: <strong className="text-blue-400 font-mono">{activeAlert.id}</strong> • Case: <strong className="text-slate-300">{activeAlert.associatedCaseId}</strong>
                  </p>
                </div>
                <StatusBadge status={activeAlert.status} />
              </div>

              {/* 1. Why are you seeing this alert? */}
              <div className="p-4 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span>Why is this finding important?</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeAlert.explanation || activeAlert.reason}
                </p>
              </div>

              {/* 2. Key Involved Suspects / Entities */}
              {activeAlert.relatedEntities && activeAlert.relatedEntities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Involved Suspects & Assets ({activeAlert.relatedEntities.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeAlert.relatedEntities.map((ent) => (
                      <div
                        key={ent.id}
                        className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <div className="font-mono text-xs font-bold text-white">{ent.id}</div>
                          <div className="text-[11px] text-slate-400">{ent.roleInAlert}</div>
                        </div>
                        <button
                          onClick={() => handleInvestigateInNetwork(ent.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold transition-colors"
                        >
                          Inspect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Recommended Next Steps */}
              <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 space-y-1 text-xs">
                <span className="font-bold text-blue-300 uppercase tracking-wider text-[11px] block">
                  Recommended Investigative Action:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeAlert.recommendedAction || 'Cross-examine subscriber records and subpoena bank transaction logs for involved accounts.'}
                </p>
              </div>

              {/* 4. Collapsible Detection Methodology */}
              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
                <button
                  onClick={() => setShowMethodology(!showMethodology)}
                  className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider"
                >
                  <span>How the system detected this pattern</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
                </button>

                {showMethodology && (
                  <div className="pt-2 border-t border-slate-800 text-xs font-mono space-y-2 text-slate-300">
                    <p>• <strong>Detection Rule:</strong> Algorithmic Graph Anomaly & Modularity Partitioning</p>
                    {activeAlert.analyticalMetrics?.map((m, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-slate-400">{m.metricName}:</span>
                        <span>Observed <strong>{m.observedValue}</strong> (Baseline {m.baselineValue})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Action Toolbar */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Update Status:</span>
                  <button
                    onClick={() => handleStatusChange(activeAlert.id, 'INVESTIGATING')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/40 text-xs font-semibold transition-colors"
                  >
                    Investigating
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeAlert.id, 'REVIEWED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold transition-colors"
                  >
                    Mark Reviewed
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleInvestigateInNetwork(activeAlert.relatedEntities?.[0]?.id || 'Person_044')}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>View in Network</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500 intel-card border border-slate-800">
              Select an alert from the left to review explainable findings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
