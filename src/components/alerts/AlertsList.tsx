import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]">NEW</span>;
      case 'INVESTIGATING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">INVESTIGATING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">REVIEWED</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      
      {/* Header & Filter */}
      <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#12304A] tracking-tight">Investigation Alerts Queue</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Algorithmic anomaly patterns flagged for officer review and sign-off
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B] font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
          >
            <option value="ALL">All Statuses ({alerts.length})</option>
            <option value="NEW">NEW ({alerts.filter(a => a.status === 'NEW').length})</option>
            <option value="INVESTIGATING">INVESTIGATING ({alerts.filter(a => a.status === 'INVESTIGATING').length})</option>
            <option value="REVIEWED">REVIEWED ({alerts.filter(a => a.status === 'REVIEWED').length})</option>
          </select>
        </div>
      </div>

      {/* Main Alert Queue Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
              <tr>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Detection Type</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Flagging Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#64748B]">Loading alerts...</td>
                </tr>
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#64748B]">No alerts in this status filter.</td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const targetEntity = alert.relatedEntities?.[0]?.label || alert.relatedEntities?.[0]?.id || alert.associatedCaseId;
                  return (
                    <tr
                      key={alert.id}
                      onClick={() => setActiveReviewAlert(alert)}
                      className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#087E8B]">
                        {alert.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#12304A]">
                        {alert.category || alert.title}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#12304A]">
                        {targetEntity}
                      </td>
                      <td className="py-3 px-4 text-[#475569] max-w-sm truncate">
                        {alert.reason}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(alert.status)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReviewAlert(alert);
                          }}
                          className="px-3 py-1 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors shadow-sm"
                        >
                          <Eye className="w-3 h-3" />
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

      {/* Review Modal Dialog */}
      {activeReviewAlert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#087E8B] text-sm">{activeReviewAlert.id}</span>
                <span className="text-xs font-bold text-[#12304A]">{activeReviewAlert.category || activeReviewAlert.title}</span>
              </div>
              <button
                onClick={() => setActiveReviewAlert(null)}
                className="text-[#64748B] hover:text-[#12304A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                <div className="text-[10px] uppercase font-bold text-[#64748B]">Target Entity / Scope</div>
                <div className="font-mono font-bold text-sm text-[#12304A] mt-0.5">
                  {activeReviewAlert.relatedEntities?.[0]?.label || activeReviewAlert.relatedEntities?.[0]?.id || activeReviewAlert.associatedCaseId}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#64748B]">Reason for Flag</div>
                <p className="text-xs text-[#17212B] leading-relaxed p-3 bg-[#F8FAFC] rounded-md border border-[#E2E8F0]">
                  {activeReviewAlert.reason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    const target = activeReviewAlert.relatedEntities?.[0]?.id || 'Person_044';
                    handleInspectEntity(target);
                  }}
                  className="py-2 px-3 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold text-center transition-colors shadow-sm"
                >
                  Inspect in Graph
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(activeReviewAlert.id, 'REVIEWED');
                  }}
                  className="py-2 px-3 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold text-center transition-colors shadow-sm"
                >
                  Mark as Reviewed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
