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
  GitFork,
  Activity
} from 'lucide-react';
import { Alert, AlertStatus } from '../../types';
import { alertService } from '../../services/alertService';
import { PriorityBadge, StatusBadge, EntityTypeBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

export const AlertsList: React.FC = () => {
  const { navigateTo, setSelectedEntityId, selectedAlertId } = useInvestigation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const handleInvestigateInNetwork = (entityId: string) => {
    setSelectedEntityId(entityId);
    navigateTo('network', { entityId });
  };

  return (
    <div className="space-y-4 select-none">
      {/* Filter and Overview Bar */}
      <div className="intel-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Pattern & Intelligence Anomaly Queue ({filtered.length} Flagged Leads)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Severity</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New Alerts</option>
            <option value="INVESTIGATING">Under Investigation</option>
            <option value="REVIEWED">Reviewed</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Alert Cards, Right Explainability Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Alerts List (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-400">
              Loading explainable pattern alerts from graph engine...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-400">
              No alerts match the selected criteria.
            </div>
          ) : (
            filtered.map((alert) => {
              const isSelected = activeAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setActiveAlert(alert)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{alert.id}</span>
                      <PriorityBadge priority={alert.severity} />
                    </div>
                    <StatusBadge status={alert.status} />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {alert.reason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                    <span>{alert.category}</span>
                    <span className="text-slate-400">{alert.timestamp}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Alert Explainability Diagnostic Dossier (7 Cols) */}
        <div className="lg:col-span-7">
          {activeAlert ? (
            <div className="intel-card p-6 rounded-xl border border-slate-800 space-y-5">
              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-base font-bold text-white">
                      {activeAlert.id} // {activeAlert.title}
                    </h3>
                    <PriorityBadge priority={activeAlert.severity} />
                  </div>
                  <p className="text-xs text-slate-400">
                    Category: <span className="font-mono text-cyan-300">{activeAlert.category}</span> • Case: <span className="font-mono text-slate-300">{activeAlert.associatedCaseId}</span>
                  </p>
                </div>

                {/* Status Triage Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
                  {(['NEW', 'INVESTIGATING', 'REVIEWED'] as AlertStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeAlert.id, st)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                        activeAlert.status === st
                          ? 'bg-cyan-500 text-black shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explainability / Why it was flagged */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Analytical Explainability & Pattern Evidence</span>
                </h5>
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>{activeAlert.explanation}</p>
                </div>
              </div>

              {/* Analytical Metrics Comparison Table */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Quantitative Signal Verification</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeAlert.analyticalMetrics.map((metric, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1 font-mono">
                      <div className="text-[10px] text-slate-400 uppercase truncate">{metric.metricName}</div>
                      <div className="text-sm font-bold text-rose-400">{metric.observedValue}</div>
                      <div className="text-[9px] text-slate-500">Baseline: {metric.baselineValue}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Entities in this Pattern */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-purple-400" />
                  <span>Involved Network Entities</span>
                </h5>
                <div className="space-y-2">
                  {activeAlert.relatedEntities.map((ent) => (
                    <div
                      key={ent.id}
                      className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <EntityTypeBadge type={ent.type} />
                        <div>
                          <div className="text-xs font-bold font-mono text-white">{ent.label}</div>
                          <div className="text-[10px] text-cyan-400">{ent.roleInAlert}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInvestigateInNetwork(ent.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-mono text-indigo-300 transition-colors"
                      >
                        <span>Investigate in Network</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <h6 className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Recommended Investigative Action</span>
                </h6>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeAlert.recommendedAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="intel-card p-12 text-center text-xs font-mono text-slate-400 rounded-xl border border-slate-800">
              Select an alert from the queue to review explainability diagnostics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
