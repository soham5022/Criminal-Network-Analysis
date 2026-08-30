import React, { useEffect, useState } from 'react';
import { 
  Folder, 
  AlertTriangle, 
  Users, 
  Network, 
  ArrowRight, 
  FolderOpen, 
  Clock, 
  Search,
  CheckCircle2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { useAuth } from '../context/AuthContext';
import { caseService } from '../services/caseService';
import { alertService } from '../services/alertService';
import { auditService, AuditEvent } from '../services/auditService';
import { Case, Alert } from '../types';

export const Overview: React.FC = () => {
  const { navigateTo, setActiveCaseId, setSelectedEntityId, setSelectedAlertId, setSearchQuery } = useInvestigation();
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
    const entityId = alert.relatedEntities?.[0]?.id || 'Person_044';
    setSelectedEntityId(entityId);
    setSelectedAlertId(alert.id);
    navigateTo('alerts', { alertId: alert.id, entityId, caseId: alert.associatedCaseId });
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Header Banner & Quick Search */}
      <div className="intel-card p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold mb-0.5">
            <span>OPERATIONAL DASHBOARD</span>
            <span>•</span>
            <span className="text-slate-400 font-sans">TraceNet — AI-Powered Criminal Network Analysis System (SIH26189)</span>
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight">
            Investigator Workspace — {user?.name || 'Inspector Rajesh Verma'}
          </h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px] sm:min-w-[340px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search case, entity, phone, account..."
            className="w-full pl-9 pr-20 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* 2. Compact Operational Statistics (4 KPI Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div 
          onClick={() => navigateTo('cases')}
          className="intel-card p-4 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>ACTIVE CASES</span>
            <Folder className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">12</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">3 high priority</span>
            <span>dossiers</span>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('alerts')}
          className="intel-card p-4 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>OPEN ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">7</div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span className="text-rose-400 font-medium">4 require</span>
            <span>immediate review</span>
          </div>
        </div>

        <div 
          onClick={() => navigateTo('entities')}
          className="intel-card p-4 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>ENTITIES</span>
            <Users className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">1,284</div>
          <div className="text-[11px] text-slate-400">
            Across 6 network categories
          </div>
        </div>

        <div 
          onClick={() => navigateTo('network')}
          className="intel-card p-4 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-1 group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>RELATIONSHIPS</span>
            <Network className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">4,821</div>
          <div className="text-[11px] text-slate-400">
            Multi-source link graph
          </div>
        </div>
      </div>

      {/* 3. Cases Requiring Attention Table */}
      <div className="intel-card border border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 bg-[#090e1a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Cases Requiring Attention
            </h2>
          </div>
          <button
            onClick={() => navigateTo('cases')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Case Name</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr 
                onClick={() => handleOpenCase('CASE-1024')} 
                className="hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-blue-400">CASE-1024</td>
                <td className="py-3 px-4 font-semibold text-white">Operation Meridian</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    High
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Today (12 mins ago)</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCase('CASE-1024');
                    }}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>Open</span>
                  </button>
                </td>
              </tr>

              <tr 
                onClick={() => handleOpenCase('CASE-1031')} 
                className="hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-blue-400">CASE-1031</td>
                <td className="py-3 px-4 font-semibold text-white">Project Shadowline</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Medium
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">Yesterday</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCase('CASE-1031');
                    }}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>Open</span>
                  </button>
                </td>
              </tr>

              <tr 
                onClick={() => handleOpenCase('CASE-1042')} 
                className="hover:bg-slate-800/60 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-mono font-bold text-blue-400">CASE-1042</td>
                <td className="py-3 px-4 font-semibold text-white">Transit Network</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    High
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400">2 days ago</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCase('CASE-1042');
                    }}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>Open</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Recent Alerts Table Queue */}
      <div className="intel-card border border-slate-800 overflow-hidden space-y-0">
        <div className="p-4 bg-[#090e1a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Recent Alerts (Investigation Queue)
            </h2>
          </div>
          <button
            onClick={() => navigateTo('alerts')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 font-mono">
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
                      className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">{alert.id}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">{alert.title}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-300">
                        {entId} <span className="text-[9px] text-slate-500 font-normal">({entType})</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{alert.reason}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          alert.status === 'NEW' 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : alert.status === 'INVESTIGATING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
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
                          className="px-3 py-1 rounded bg-amber-600/20 hover:bg-amber-600 border border-amber-500/40 text-amber-200 hover:text-white font-semibold transition-colors text-[11px]"
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
      <div className="intel-card border border-slate-800 overflow-hidden space-y-0 shadow-lg">
        <div className="p-4 bg-[#090e1a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Recent Investigation Activity (Audit Ledger)
            </h2>
          </div>
          <button
            onClick={() => navigateTo('audit')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View Full Audit Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {recentAudits.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              No recent investigation actions recorded.
            </div>
          ) : (
            recentAudits.map((ev) => (
              <div
                key={ev.id}
                onClick={() => navigateTo('audit')}
                className="p-3.5 hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white truncate">{ev.actionLabel}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700 uppercase font-bold">
                        {ev.module}
                      </span>
                      {ev.caseId && (
                        <span className="text-[10px] font-mono font-bold text-blue-400">
                          {ev.caseId}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{ev.details}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 text-[11px] font-mono text-slate-400">
                  <div>{ev.userName.split(' ')[0]} ({ev.userBadge})</div>
                  <div className="text-[10px] text-slate-500">{ev.timeFormatted}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

