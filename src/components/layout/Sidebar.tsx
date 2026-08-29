import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  Network, 
  AlertTriangle, 
  Clock, 
  FileSpreadsheet, 
  FileText, 
  FolderArchive,
  Settings as SettingsIcon,
  ShieldCheck,
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  User,
  ShieldAlert
} from 'lucide-react';
import { useInvestigation, AppPage } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/alertService';
import { caseService } from '../../services/caseService';

export const Sidebar: React.FC = () => {
  const { currentPage, navigateTo, setIsLoginModalOpen } = useInvestigation();
  const { user, logout } = useAuth();
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

  const mainNavItems: { id: AppPage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: Folder, badge: `${caseCount}` },
    { id: 'case-records', label: 'Case Records', icon: FolderArchive, badge: '10' },
    { id: 'entities', label: 'Entities', icon: Users },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: `${alertCount}` },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'evidence', label: 'Evidence', icon: FileSpreadsheet },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  const adminNavItems: { id: AppPage; label: string; icon: React.ElementType }[] = [
    { id: 'settings', label: 'Administration', icon: SettingsIcon },
    { id: 'audit', label: 'Audit Log', icon: ShieldCheck }
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-800 bg-[#0c1322] transition-all duration-150 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Government App Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800 bg-[#090e1a]">
        <div 
          className="flex items-center gap-2.5 overflow-hidden cursor-pointer" 
          onClick={() => navigateTo('dashboard')}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-700 border border-blue-500/30 flex items-center justify-center text-white shadow-sm flex-shrink-0 font-bold text-sm">
            T
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-wide text-white font-mono">TraceNet</span>
              <span className="text-[10px] text-slate-400 truncate">SIH Prototype</span>
            </div>
          )}

        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Navigation Items */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Investigation
          </div>
        )}

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || 
            (item.id === 'dashboard' && currentPage === 'overview') ||
            (item.id === 'network' && currentPage === 'investigate');
          
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && !isActive && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Administration Section */}
        <div className="pt-3 pb-1">
          <div className="h-px bg-slate-800 mx-2" />
        </div>

        {!isCollapsed && (
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            System & Security
          </div>
        )}

        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {!isCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logged-In Investigator & Role Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#090e1a] text-xs">
        {!isCollapsed ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs shrink-0">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-200 truncate text-xs">
                  {user?.name || 'Inspector Rajesh Verma'}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {user?.role || 'INVESTIGATOR'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {user?.badge_number || 'MHA-8902'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigateTo('landing');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors border border-slate-800"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full flex justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title={`${user?.name || 'Inspector Rajesh Verma'} (${user?.role || 'INVESTIGATOR'})`}
          >
            <User className="w-4 h-4 text-blue-400" />
          </button>
        )}
      </div>
    </aside>
  );
};

