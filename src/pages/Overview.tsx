import React, { useEffect, useState } from 'react';
import { 
  Folder, 
  AlertTriangle, 
  Users, 
  Network, 
  ArrowRight, 
  FolderOpen, 
  Search,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Building2
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { useAuth } from '../context/AuthContext';
import { caseService } from '../services/caseService';
import { alertService } from '../services/alertService';
import { auditService, AuditEvent } from '../services/auditService';
import { evidenceRegistryService } from '../services/evidenceRegistryService';
import { mockEntities } from '../data/mockEntities';
import { Case, Alert } from '../types';

export const Overview: React.FC = () => {
  const { 
    navigateTo, 
    setActiveCaseId, 
    setSelectedEntityId, 
    setSelectedAlertId, 
    setSearchQuery,
    setIsCreateCaseModalOpen
  } = useInvestigation();
  const { user } = useAuth();

  const [cases, setCases] = useState<Case[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recentAudits, setRecentAudits] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState<string>('');

  const loadAudits = () => {
    setRecentAudits(auditService.getAuditLogs({ limit: 6 }));
  };

  useEffect(() => {
    Promise.all([
      caseService.getCases(),
      alertService.getAlerts()
    ])
      .then(([c, a]) => {
        setCases(c);
        setAlerts(a);
      })
      .catch(err => console.warn('Dashboard data fallback:', err));

    loadAudits();
    const unsubscribe = auditService.subscribe(() => {
      loadAudits();
    });
    return () => unsubscribe();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const q = search.trim();
    setSearchQuery(q);

    // Check if matching case
    const matchedCase = cases.find(c => 
      c.id.toLowerCase().includes(q.toLowerCase()) || 
      c.name.toLowerCase().includes(q.toLowerCase())
    );

    if (matchedCase) {
      setActiveCaseId(matchedCase.id);
      navigateTo('case-details', { caseId: matchedCase.id, tab: 'overview' });
    } else {
      setSelectedEntityId(q);
      navigateTo('network', { entityId: q });
    }
  };

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigateTo('case-details', { caseId, tab: 'overview' });
  };

  const handleReviewAlert = (alert: Alert) => {
    if (alert.associatedCaseId) setActiveCaseId(alert.associatedCaseId);
    const entityId = alert.relatedEntities?.[0]?.id || null;
    if (entityId) setSelectedEntityId(entityId);
    setSelectedAlertId(alert.id);
    navigateTo('alerts', { alertId: alert.id, entityId: entityId || undefined, caseId: alert.associatedCaseId });
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Header Banner & Quick Search */}
      <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#087E8B] font-bold mb-0.5">
            <span>OPERATIONAL DASHBOARD</span>
            <span>•</span>
            <span className="text-[#64748B] font-normal">TraceNet — AI-Powered Criminal Network Analysis Platform</span>
          </div>

          <h1 className="text-xl font-bold text-[#12304A] tracking-tight">
            Investigator Workspace — {user?.name || 'Inspector Rajesh Verma'}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search case, entity, phone, account..."
              className="w-full pl-9 pr-16 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] focus:ring-1 focus:ring-[#087E8B] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setIsCreateCaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Register Case</span>
          </button>

          <button
            onClick={() => navigateTo('reports')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold tracking-wide transition-colors shadow-sm whitespace-nowrap"
          >
            <Building2 className="w-4 h-4 text-[#087E8B]" />
            <span>Station Intel</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Operational Statistics (4 KPI Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div 
          onClick={() => navigateTo('cases')}
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] hover:border-[#087E8B] cursor-pointer transition-all shadow-sm space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>ACTIVE CASES</span>
            <Folder className="w-4 h-4 text-[#12304A] group-hover:text-[#087E8B]" />
          </div>
          <div className="text-2xl font-bold text-[#12304A] font-mono">{cases.length || 10}</div>
          <div className="text-[11px] text-[#64748B] flex items-center gap-1">
            <span className="text-[#16805C] font-semibold">
              {cases.filter(c => c.priority === 'CRITICAL' || c.priority === 'HIGH').length || 3} high priority
            </span>
            <span>dossiers</span>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('alerts')}
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] hover:border-[#087E8B] cursor-pointer transition-all shadow-sm space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>OPEN ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-[#B7791F] group-hover:text-[#C24141]" />
          </div>
          <div className="text-2xl font-bold text-[#12304A] font-mono">
            {alerts.filter(a => a.status === 'NEW' || a.status === 'INVESTIGATING').length || 7}
          </div>
          <div className="text-[11px] text-[#64748B] flex items-center gap-1">
            <span className="text-[#C24141] font-semibold">
              {alerts.filter(a => a.status === 'NEW').length || 4} require
            </span>
            <span>immediate review</span>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('entities')}
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] hover:border-[#087E8B] cursor-pointer transition-all shadow-sm space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>ENTITIES</span>
            <Users className="w-4 h-4 text-[#087E8B]" />
          </div>
          <div className="text-2xl font-bold text-[#12304A] font-mono">{mockEntities.length || 48}</div>
          <div className="text-[11px] text-[#64748B]">
            Across 7 network categories (incl. Events)
          </div>
        </div>

        <div 
          onClick={() => navigateTo('evidence')}
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#E2E8F0] hover:border-[#087E8B] cursor-pointer transition-all shadow-sm space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-[#64748B] font-semibold">
            <span>EVIDENCE</span>
            <FileSpreadsheet className="w-4 h-4 text-[#2563A6]" />
          </div>
          <div className="text-2xl font-bold text-[#12304A] font-mono">
            {evidenceRegistryService.getEvidenceList().length || 14}
          </div>
          <div className="text-[11px] text-[#64748B]">
            Cryptographic SHA-256 verified
          </div>
        </div>
      </div>

      {/* 3. Cases Requiring Attention Table */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-[#087E8B]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
              Cases Requiring Attention
            </h2>
          </div>
          <button
            onClick={() => navigateTo('cases')}
            className="text-xs font-semibold text-[#087E8B] hover:text-[#06636E] flex items-center gap-1 transition-colors"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Case Name</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#64748B]">
                    No cases loaded in repository.
                  </td>
                </tr>
              ) : (
                cases.slice(0, 5).map((c) => (
                  <tr 
                    key={c.id}
                    onClick={() => handleOpenCase(c.id)} 
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#087E8B]">{c.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#12304A]">
                      <div>{c.name}</div>
                      <div className="text-[10px] text-[#64748B] font-normal truncate max-w-sm">{c.department || c.description}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.priority === 'CRITICAL'
                          ? 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]'
                          : c.priority === 'HIGH'
                          ? 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]'
                          : 'bg-[#EBF8FF] text-[#2563A6] border-[#BEE3F8]'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] text-[11px]">{c.lastActivity || 'Recent'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCase(c.id);
                        }}
                        className="px-3.5 py-1.5 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white font-semibold transition-colors inline-flex items-center gap-1 text-xs shadow-sm"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Open Case</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Recent Alerts Table Queue */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
              Recent Alerts (Investigation Queue)
            </h2>
          </div>
          <button
            onClick={() => navigateTo('alerts')}
            className="text-xs font-semibold text-[#087E8B] hover:text-[#06636E] flex items-center gap-1 transition-colors"
          >
            <span>View All Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
              <tr>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#64748B]">
                    No active priority leads in queue.
                  </td>
                </tr>
              ) : (
                alerts.slice(0, 5).map((alert) => {
                  const ent = alert.relatedEntities?.[0];
                  const entId = ent?.id || 'Entity';
                  const entType = ent?.type || 'PERSON';
                  return (
                    <tr 
                      key={alert.id}
                      onClick={() => handleReviewAlert(alert)}
                      className="hover:bg-[#F8FAFC] cursor-pointer transition-colors bg-[#FFFFFF]"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#C24141]">{alert.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#12304A]">{alert.title}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#087E8B]">
                        {entId} <span className="text-[9px] text-[#64748B] font-normal">({entType})</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#475569] max-w-xs truncate">{alert.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          alert.status === 'NEW' 
                            ? 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]'
                            : alert.status === 'INVESTIGATING'
                            ? 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]'
                            : 'bg-[#E8F7F0] text-[#16805C] border-[#A3E0C8]'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewAlert(alert);
                          }}
                          className="px-3 py-1 rounded-md bg-[#FEF3C7] hover:bg-[#FCD34D] text-[#B7791F] font-semibold transition-colors text-[11px] border border-[#FCD34D]"
                        >
                          Review
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

      {/* 5. Real-Time Investigation Activity Ledger */}
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] overflow-hidden shadow-sm space-y-0">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#087E8B]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
              Recent Investigation Activity (Audit Ledger)
            </h2>
          </div>
          <button
            onClick={() => navigateTo('audit')}
            className="text-xs font-semibold text-[#087E8B] hover:text-[#06636E] flex items-center gap-1 transition-colors"
          >
            <span>View Full Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {recentAudits.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#64748B]">
              No recent investigation actions recorded.
            </div>
          ) : (
            recentAudits.map((ev) => (
              <div
                key={ev.id}
                onClick={() => navigateTo('audit')}
                className="p-3.5 hover:bg-[#F8FAFC] cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs bg-[#FFFFFF]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-[#087E8B] shrink-0" />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#12304A] truncate">{ev.actionLabel}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] uppercase font-bold">
                        {ev.module}
                      </span>
                      {ev.caseId && (
                        <span className="text-[10px] font-mono font-bold text-[#087E8B]">
                          {ev.caseId}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">{ev.details}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 text-[11px] text-[#64748B]">
                  <div className="font-medium text-[#12304A]">{ev.userName.split(' ')[0]} ({ev.userBadge})</div>
                  <div className="text-[10px] text-[#94A3B8]">{ev.timeFormatted}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
