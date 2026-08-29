import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Check, 
  X, 
  User, 
  Network, 
  FileSpreadsheet, 
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Alert, AlertStatus } from '../../types';
import { alertService } from '../../services/alertService';
import { useInvestigation } from '../../context/InvestigationContext';

export const AlertsList: React.FC = () => {
  const { navigateTo, setSelectedEntityId, selectedAlertId, setActiveCaseId, setActiveCaseTab } = useInvestigation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeReviewAlert, setActiveReviewAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    setLoading(true);
    alertService.getAlerts()
      .then(data => {
        setAlerts(data);
        if (selectedAlertId) {
          const matched = data.find(a => a.id === selectedAlertId);
          if (matched) setActiveReviewAlert(matched);
        }
      })
      .catch(err => console.warn('Alerts fetch error:', err))
      .finally(() => setLoading(false));
  }, [selectedAlertId]);

  const handleUpdateStatus = async (alertId: string, nextStatus: AlertStatus) => {
    try {
      await alertService.updateAlertStatus(alertId, nextStatus);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: nextStatus } : a));
      if (activeReviewAlert?.id === alertId) {
        setActiveReviewAlert(prev => prev ? { ...prev, status: nextStatus } : null);
      }
    } catch (err) {
      console.warn('Update alert status error:', err);
    }
  };

  const handleInspectEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    navigateTo('network', { entityId });
  };

  const filteredAlerts = alerts.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">NEW</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">INVESTIGATING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">REVIEWED</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* Header & Filter */}
      <div className="intel-card p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Investigation Alerts Queue</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic anomaly patterns flagged for officer review and sign-off
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses ({alerts.length})</option>
            <option value="NEW">NEW ({alerts.filter(a => a.status === 'NEW').length})</option>
            <option value="INVESTIGATING">INVESTIGATING ({alerts.filter(a => a.status === 'INVESTIGATING').length})</option>
            <option value="REVIEWED">REVIEWED ({alerts.filter(a => a.status === 'REVIEWED').length})</option>
          </select>
        </div>
      </div>

      {/* Main Alert Queue Table */}
      <div className="intel-card border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Detection Type</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Flagging Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">Loading alerts...</td>
                </tr>
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-400">No alerts match the selected filter.</td>
                </tr>
              ) : (
                filteredAlerts.map((alt) => {
                  const targetEntity = alt.relatedEntities?.[0]?.id || (alt.id === 'ALT-9044' ? 'Account_103' : 'Person_044');
                  return (
                    <tr 
                      key={alt.id}
                      onClick={() => setActiveReviewAlert(alt)}
                      className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        activeReviewAlert?.id === alt.id ? 'bg-slate-800/80 border-l-2 border-l-blue-500' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400 whitespace-nowrap">
                        {alt.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {alt.title}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-300 whitespace-nowrap">
                        {targetEntity}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-sm">
                        {alt.reason || 'Structural anomaly across 3 modularity clusters.'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(alt.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveReviewAlert(alt)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Details Drawer (Modal / Side Drawer when reviewing) */}
      {activeReviewAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-end p-0 select-none animate-in fade-in">
          <div 
            className="w-full max-w-lg h-full bg-[#0c1322] border-l border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400">{activeReviewAlert.id}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 text-xs">{activeReviewAlert.associatedCaseId || 'CASE-1024'}</span>
                </div>
                <h2 className="text-base font-bold text-white">{activeReviewAlert.title}</h2>
              </div>
              <button
                onClick={() => setActiveReviewAlert(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {/* Status Toggle Bar */}
              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Investigation Status:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeReviewAlert.id, 'NEW')}
                    className={`py-1.5 rounded-lg font-bold text-xs border transition-all ${
                      activeReviewAlert.status === 'NEW'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    [ NEW ]
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeReviewAlert.id, 'INVESTIGATING')}
                    className={`py-1.5 rounded-lg font-bold text-xs border transition-all ${
                      activeReviewAlert.status === 'INVESTIGATING'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    [ INVESTIGATING ]
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeReviewAlert.id, 'REVIEWED')}
                    className={`py-1.5 rounded-lg font-bold text-xs border transition-all ${
                      activeReviewAlert.status === 'REVIEWED'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    [ REVIEWED ]
                  </button>
                </div>
              </div>

              {/* Flagging Reason */}
              <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Flagging Reason
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {activeReviewAlert.reason || 'Cross-community structural bridge identified between 3 separate network partitions.'}
                </p>
              </div>

              {/* Supporting Evidence */}
              <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Supporting Evidence
                </span>
                <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                  {activeReviewAlert.evidenceRef || 'CDR tower logs and banking switch records verify 7 edge handshakes between Community 1, 2, and 3.'}
                </p>
              </div>

              {/* Analytical Factors */}
              <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Analytical Factors
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Betweenness Centrality:</span>
                    <span className="font-mono text-white font-semibold">0.612 (High)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Bridge Edge Count:</span>
                    <span className="font-mono text-white font-semibold">7 cross-group connections</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Detection Confidence:</span>
                    <span className="font-mono text-emerald-400 font-semibold">96.4%</span>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block">
                  Recommended Investigative Action
                </span>
                <p className="text-slate-200 leading-relaxed">
                  Initiate targeted CDR interception for {activeReviewAlert.relatedEntities?.[0]?.id || 'Person_044'} and inspect linked transaction endpoints.
                </p>
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-[#090e1a] space-y-2">
              <button
                onClick={() => {
                  const targetEntity = activeReviewAlert.relatedEntities?.[0]?.id || 'Person_044';
                  setActiveReviewAlert(null);
                  handleInspectEntity(targetEntity);
                }}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Network className="w-4 h-4" />
                <span>Inspect in Link Graph</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
