import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronRight, 
  FolderOpen, 
  X, 
  Tv, 
  User, 
  LogOut, 
  KeyRound, 
  UploadCloud,
  Check
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { caseService } from '../../services/caseService';
import { alertService } from '../../services/alertService';
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

  useEffect(() => {
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
    id: activeCaseId || 'CASE-1024',
    name: 'Investigation Dossier',
    description: 'Multi-source case investigation.'
  };
  const newAlerts = alerts.filter(a => a.status === 'NEW');

  const pageTitleMap: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Operational overview, active cases, and priority leads.' },
    overview: { title: 'Dashboard', subtitle: 'Operational overview, active cases, and priority leads.' },
    cases: { title: 'Cases Directory', subtitle: 'Active investigative dossiers and operational files.' },
    'case-details': { title: `${activeCase.id} — ${activeCase.name}`, subtitle: activeCase.description },
    entities: { title: 'Extracted Entities', subtitle: 'Algorithmic centrality analysis and investigative leads.' },
    network: { title: 'Network Link Analysis', subtitle: 'Interactive multi-source knowledge graph and cluster inspection.' },
    investigate: { title: 'Network Link Analysis', subtitle: 'Interactive multi-source knowledge graph and cluster inspection.' },
    timeline: { title: 'Chronological Timeline', subtitle: 'Timestamped multi-source event sequence.' },
    evidence: { title: 'Digital Evidence Registry', subtitle: 'Centralized digital evidence repository, soft-copy retrieval, and SHA-256 integrity verification.' },
    alerts: { title: 'Investigation Alerts Queue', subtitle: 'Algorithmic anomaly patterns requiring officer review.' },
    reports: { title: 'Intelligence Reports', subtitle: 'Formal investigation briefs and case dossiers.' },
    settings: { title: 'Administration & System Status', subtitle: 'Component diagnostics, service health, and active officer profile.' },
    audit: { title: 'Security Audit Trail', subtitle: 'Immutable compliance record of all investigator actions.' }
  };

  const currentInfo = pageTitleMap[currentPage] || { title: 'TraceNet', subtitle: '' };

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-[#FFFFFF] px-4 sm:px-6 flex items-center justify-between z-20 select-none">
      {/* Left Title & Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span 
              className="hover:text-[#087E8B] cursor-pointer transition-colors font-medium" 
              onClick={() => navigateTo('dashboard')}
            >
              TraceNet
            </span>

            {/* Breadcrumb Hierarchy */}
            {currentPage === 'dashboard' || currentPage === 'overview' ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#087E8B] font-bold text-[11px] uppercase tracking-wider">
                  Dashboard
                </span>
              </>
            ) : currentPage === 'cases' ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#087E8B] font-bold text-[11px] uppercase tracking-wider">
                  Cases Directory
                </span>
              </>
            ) : currentPage === 'case-details' ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span 
                  className="hover:text-[#087E8B] cursor-pointer transition-colors font-medium" 
                  onClick={() => navigateTo('cases')}
                >
                  Cases
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                
                {/* Active Case Switcher Popover */}
                <div className="relative inline-block">
                  <button
                    onClick={() => setShowCaseSelector(!showCaseSelector)}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F1F5F9] hover:bg-[#E6F4F5] border border-[#CBD5E1] text-[#12304A] text-xs font-mono font-bold transition-colors"
                    title="Switch Active Case"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#087E8B]" />
                    <span>{activeCase.id} — {activeCase.name}</span>
                  </button>

                  {showCaseSelector && (
                    <div className="absolute left-0 mt-2 w-80 bg-[#FFFFFF] border border-[#CBD5E1] shadow-xl p-2 z-50 rounded-lg space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
                        Switch Active Case Dossier
                      </div>
                      {cases.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveCaseId(c.id);
                            setShowCaseSelector(false);
                          }}
                          className={`p-2 rounded-md cursor-pointer text-xs flex items-center justify-between transition-colors ${
                            c.id === activeCaseId 
                              ? 'bg-[#E6F4F5] text-[#087E8B] font-bold' 
                              : 'hover:bg-[#F8FAFC] text-[#17212B]'
                          }`}
                        >
                          <div>
                            <div className="font-mono font-bold text-[#12304A]">{c.id}</div>
                            <div className="text-[11px] text-[#64748B] truncate">{c.name}</div>
                          </div>
                          {c.id === activeCaseId && <Check className="w-3.5 h-3.5 text-[#087E8B]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-[#087E8B] uppercase tracking-wider font-bold text-[11px]">
                  {currentPage.replace('-', ' ')}
                </span>
                
                {/* Active Case Context for other sub-pages */}
                <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] hidden sm:inline" />
                <div className="relative hidden sm:inline-block">
                  <button
                    onClick={() => setShowCaseSelector(!showCaseSelector)}
                    className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F1F5F9] hover:bg-[#E6F4F5] border border-[#CBD5E1] text-[#12304A] text-xs font-mono font-bold transition-colors"
                    title="Active Case Filter"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#087E8B]" />
                    <span>{activeCase.id}</span>
                  </button>

                  {showCaseSelector && (
                    <div className="absolute left-0 mt-2 w-80 bg-[#FFFFFF] border border-[#CBD5E1] shadow-xl p-2 z-50 rounded-lg space-y-1">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B] border-b border-[#E2E8F0]">
                        Switch Active Case Scope
                      </div>
                      {cases.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setActiveCaseId(c.id);
                            setShowCaseSelector(false);
                          }}
                          className={`p-2 rounded-md cursor-pointer text-xs flex items-center justify-between transition-colors ${
                            c.id === activeCaseId 
                              ? 'bg-[#E6F4F5] text-[#087E8B] font-bold' 
                              : 'hover:bg-[#F8FAFC] text-[#17212B]'
                          }`}
                        >
                          <div>
                            <div className="font-mono font-bold text-[#12304A]">{c.id}</div>
                            <div className="text-[11px] text-[#64748B] truncate">{c.name}</div>
                          </div>
                          {c.id === activeCaseId && <Check className="w-3.5 h-3.5 text-[#087E8B]" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <h1 className="text-sm sm:text-base font-bold text-[#12304A] tracking-tight truncate flex items-center gap-2">
            {currentPage === 'case-details' ? `${activeCase.id} — ${activeCase.name}` : currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Right Controls & Status */}
      <div className="flex items-center gap-2.5">
        {/* Presentation View Toggle */}
        <button
          onClick={togglePresentationMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
            isPresentationMode
              ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#087E8B]'
              : 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#64748B] hover:text-[#12304A] hover:bg-[#F8FAFC]'
          }`}
          title="Toggle Presentation View"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{isPresentationMode ? 'Exit Full View' : 'Presentation View'}</span>
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsOmniSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-[#12304A] transition-colors text-xs group shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#087E8B] transition-colors" />
          <span className="hidden md:inline">Global Search</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-[#F1F5F9] text-[10px] text-[#64748B] border border-[#CBD5E1] font-mono">
            Ctrl+K
          </kbd>
        </button>

        {/* Add Data Trigger Button */}
        <button
          onClick={() => setIsIngestionModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Add Data</span>
        </button>

        {/* Alerts Notification Drawer */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#64748B] hover:text-[#12304A] transition-colors shadow-sm"
            title="Unreviewed Alerts"
          >
            <Bell className="w-4 h-4" />
            {newAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C24141] text-white text-[10px] font-bold flex items-center justify-center">
                {newAlerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-xl p-3 space-y-2.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#12304A] uppercase tracking-wider">Unreviewed Alerts ({newAlerts.length})</span>
                <button onClick={() => setShowNotifications(false)} className="text-[#64748B] hover:text-[#12304A]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {newAlerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#64748B]">
                    No new unreviewed alerts.
                  </div>
                ) : (
                  newAlerts.map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigateTo('alerts', { alertId: alert.id });
                      }}
                      className="p-2.5 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#C24141]">{alert.id}</span>
                        <span className="text-[10px] text-[#64748B]">{alert.timestamp.split('(')[0]}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#12304A] leading-tight">{alert.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Role Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 pl-2.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-left transition-colors shadow-sm"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#12304A] flex items-center gap-1.5">
                <span>{user?.name.split(' ')[0] || 'Investigator'}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                  {user?.role || 'INVESTIGATOR'}
                </span>
              </div>
            </div>
            <div className="p-1 rounded-full bg-[#F1F5F9] text-[#087E8B]">
              <User className="w-3.5 h-3.5" />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-xl p-3 space-y-2.5 z-50">
              <div className="pb-2 border-b border-[#E2E8F0]">
                <div className="font-bold text-xs text-[#12304A]">{user?.name}</div>
                <div className="text-[11px] text-[#64748B]">{user?.email}</div>
                <div className="text-[10px] text-[#087E8B] mt-0.5 font-medium">{user?.department}</div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] text-xs text-[#12304A] transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#087E8B]" />
                  <span>Switch Role / User</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#FEE2E2] hover:bg-[#FECACA] text-xs text-[#C24141] transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#C24141]" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
