import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  FolderOpen,
  X,
  Tv,
  User,
  LogOut,
  KeyRound,
  Activity
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { caseService } from '../../services/caseService';
import { alertService } from '../../services/alertService';
import { healthService } from '../../services/healthService';
import { Case, Alert } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    activeCaseId, 
    setActiveCaseId, 
    setIsOmniSearchOpen, 
    navigateTo,
    setIsIngestionModalOpen,
    setIsLoginModalOpen,
    isPresentationMode,
    togglePresentationMode
  } = useInvestigation();

  const { user, logout } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCaseSelector, setShowCaseSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [health, setHealth] = useState<{ status: string; api: string; neo4j: string; analysis_engine: string }>({
    status: 'healthy',
    api: 'online',
    neo4j: 'networkx_fallback',
    analysis_engine: 'ready'
  });

  useEffect(() => {
    healthService.getHealth()
      .then(setHealth)
      .catch(err => console.warn('Health check fallback:', err));

    caseService.getCases()
      .then(setCases)
      .catch(err => console.warn('Header cases fallback:', err));
  }, []);

  useEffect(() => {
    alertService.getAlerts({ caseId: activeCaseId })
      .then(setAlerts)
      .catch(err => console.warn('Header alerts fallback:', err));
  }, [activeCaseId]);

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0] || {
    id: 'CASE-1024',
    name: 'Operation Meridian',
    description: 'Cross-border narcotics distribution & hawala laundering syndicate'
  };
  const newAlerts = alerts.filter(a => a.status === 'NEW');

  const pageTitleMap: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Investigation Overview', subtitle: 'Monitor cases, entities, relationships and emerging patterns.' },
    cases: { title: 'Investigation Dossiers', subtitle: 'Manage active multi-agency operations and evidence collections.' },
    'case-details': { title: `${activeCase.id} — ${activeCase.name}`, subtitle: activeCase.description },
    network: { title: 'Interactive Network Analysis', subtitle: 'Cytoscape.js force-directed knowledge graph & community clustering.' },
    entities: { title: 'Entity Intelligence Directory', subtitle: 'Discovered persons, phones, accounts, locations, organizations, and transport assets.' },
    timeline: { title: 'Multi-Source Chronology', subtitle: 'Temporal alignment across CDR intercepts, banking ledgers, CCTV, and surveillance.' },
    alerts: { title: 'Pattern & Intelligence Alerts', subtitle: 'Explainable AI anomaly detection and multi-cluster bridge indicators.' },
    reports: { title: 'Intelligence Reports & Dossiers', subtitle: 'Synthesized investigative findings and exportable law enforcement briefs.' },
    audit: { title: 'Security & Compliance Audit Trail', subtitle: 'Cryptographically verified log recording all user access, case modifications, and graph executions.' }
  };

  const currentInfo = pageTitleMap[currentPage] || { title: 'NEXUS INTEL', subtitle: '' };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#090e1b]/95 backdrop-blur-md px-6 flex items-center justify-between z-20 select-none">
      {/* Left Title & Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="hover:text-cyan-300 cursor-pointer transition-colors" onClick={() => navigateTo('overview')}>
              NEXUS INTEL
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 uppercase tracking-wider font-semibold">
              {currentPage.replace('-', ' ')}
            </span>
            {currentPage !== 'overview' && currentPage !== 'cases' && currentPage !== 'audit' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <button
                  onClick={() => setShowCaseSelector(!showCaseSelector)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  title="Switch Active Case"
                >
                  <FolderOpen className="w-3 h-3 text-cyan-400" />
                  <span>{activeCase.id}</span>
                </button>
              </>
            )}
          </div>
          <h1 className="text-base lg:text-lg font-bold text-white tracking-tight truncate flex items-center gap-2">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Right Controls & Status */}
      <div className="flex items-center gap-3">
        {/* System Health Indicators */}
        <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>API</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>{health.neo4j === 'connected' ? 'Neo4j Bolt' : 'NetworkX Engine'}</span>
          </span>
        </div>

        {/* Presentation Mode Switcher */}
        <button
          onClick={togglePresentationMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
            isPresentationMode
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Judge Presentation Mode"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{isPresentationMode ? 'Exit Presentation' : 'Presentation'}</span>
        </button>

        {/* Global Omni-Search Button */}
        <button
          onClick={() => setIsOmniSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs font-mono group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="hidden md:inline">Omni-Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Ingest Data Trigger */}
        <button
          onClick={() => setIsIngestionModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
        >
          <span>Ingest Data</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Pattern Alerts"
          >
            <Bell className="w-4 h-4" />
            {newAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {newAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 intel-card rounded-xl border border-slate-700 shadow-2xl p-3 space-y-2.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Unresolved Alerts ({newAlerts.length})</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {newAlerts.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-slate-500">
                    No new unresolved alerts.
                  </div>
                ) : (
                  newAlerts.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigateTo('alerts', { alertId: alert.id });
                      }}
                      className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-rose-400">{alert.id}</span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp.split('(')[0]}</span>
                      </div>
                      <p className="text-xs font-semibold text-white leading-tight">{alert.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account & Role Badge Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-left transition-all"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{user?.name.split(' ')[0] || 'Investigator'}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                  user?.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                  user?.role === 'VIEWER' ? 'bg-slate-800 text-slate-400' :
                  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  {user?.role || 'INVESTIGATOR'}
                </span>
              </div>
            </div>
            <div className="p-1 rounded-full bg-slate-800 text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 intel-card rounded-xl border border-slate-700 shadow-2xl p-3 space-y-2.5 z-50 animate-in fade-in">
              <div className="pb-2 border-b border-slate-800">
                <div className="font-bold text-xs text-white">{user?.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{user?.email}</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">{user?.department}</div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Switch Role / Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 text-xs text-rose-300 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
