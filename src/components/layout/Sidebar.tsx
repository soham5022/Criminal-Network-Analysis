import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  AlertTriangle, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  FolderPlus,
  Compass
} from 'lucide-react';
import { useInvestigation, AppPage } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/alertService';
import { caseService } from '../../services/caseService';

export const Sidebar: React.FC = () => {
  const { currentPage, navigateTo, setIsCreateCaseModalOpen, activeCaseId } = useInvestigation();
  const { canEdit, canViewAudit } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [alertCount, setAlertCount] = useState<number>(6);
  const [caseCount, setCaseCount] = useState<number>(4);

  useEffect(() => {
    alertService.getAlerts({ status: 'NEW' as any })
      .then(a => setAlertCount(a.length))
      .catch(() => {});

    caseService.getCases()
      .then(c => setCaseCount(c.length))
      .catch(() => {});
  }, []);

  const navItems: { id: AppPage; label: string; icon: React.ElementType; badge?: string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: Briefcase, badge: `${caseCount}` },
    { id: 'investigate', label: 'Investigate', icon: Search },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: `${alertCount}`, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    { id: 'reports', label: 'Reports', icon: FileText },
    ...(canViewAudit ? [{ id: 'audit' as AppPage, label: 'Audit Log', icon: ShieldCheck }] : [])
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-800 bg-[#0c1322] transition-all duration-200 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* App Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#090e1a]">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigateTo('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wide text-white">NEXUS</span>
                <span className="font-medium text-sm tracking-wider text-blue-400">INTEL</span>
              </div>
              <span className="text-[11px] text-slate-400 truncate">
                Case Intelligence
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* New Case Button */}
      {canEdit && (
        <div className="p-3 border-b border-slate-800/80">
          <button
            onClick={() => setIsCreateCaseModalOpen(true)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors ${
              isCollapsed ? 'px-2' : 'px-3'
            }`}
            title="Create New Case"
          >
            <FolderPlus className="w-4 h-4" />
            {!isCollapsed && <span>New Case</span>}
          </button>
        </div>
      )}

      {/* Simplified Primary Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || 
            (item.id === 'dashboard' && currentPage === 'overview') ||
            (item.id === 'investigate' && (currentPage === 'network' || currentPage === 'entities' || currentPage === 'timeline'));
          
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors relative ${
                isActive
                  ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-500 rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${
                isActive ? 'text-blue-400' : 'text-slate-400'
              }`} />
              
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User / Station Info */}
      <div className="p-3 border-t border-slate-800 bg-[#090e1a] text-[11px] text-slate-400">
        {!isCollapsed ? (
          <div>
            <div className="font-semibold text-slate-300">Case Officer Terminal</div>
            <div className="text-[10px] text-slate-500">Authorized Official Access</div>
          </div>
        ) : (
          <div className="text-center font-bold text-slate-400">LEA</div>
        )}
      </div>
    </aside>
  );
};
