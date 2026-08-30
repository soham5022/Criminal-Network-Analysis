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
  User
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
  const [caseCount, setCaseCount] = useState<number>(10);

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
      className={`relative flex flex-col border-r border-[#E2E8F0] bg-[#FFFFFF] transition-all duration-150 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Government App Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#E2E8F0] bg-[#FFFFFF]">
        <div 
          className="flex items-center gap-2.5 overflow-hidden cursor-pointer" 
          onClick={() => navigateTo('dashboard')}
        >
          <div className="w-8 h-8 rounded-lg bg-[#12304A] flex items-center justify-center text-white shadow-sm flex-shrink-0 font-bold text-sm">
            T
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-wide text-[#12304A] font-sans">TraceNet</span>
              <span className="text-[10px] text-[#64748B] truncate">Investigation Platform</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#F1F5F9] transition-colors"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Navigation Items */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto bg-[#FFFFFF]">
        {!isCollapsed && (
          <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
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
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all relative ${
                isActive
                  ? 'bg-[#E6F4F5] text-[#087E8B] border-l-4 border-[#087E8B]'
                  : 'text-[#475569] hover:text-[#12304A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#087E8B]' : 'text-[#64748B]'}`} />
              
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                  isActive 
                    ? 'bg-[#FFFFFF] text-[#087E8B] border-[#A7DFE3]' 
                    : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Administration Section */}
        <div className="pt-3 pb-1">
          <div className="h-px bg-[#E2E8F0] mx-2" />
        </div>

        {!isCollapsed && (
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
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
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#E6F4F5] text-[#087E8B] border-l-4 border-[#087E8B]'
                  : 'text-[#475569] hover:text-[#12304A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#087E8B]' : 'text-[#64748B]'}`} />
              {!isCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logged-In Investigator & Role Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#FFFFFF] text-xs">
        {!isCollapsed ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#E6F4F5] border border-[#A7DFE3] flex items-center justify-center text-[#087E8B] text-xs shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[#12304A] truncate text-xs">
                  {user?.name || 'Inspector Rajesh Verma'}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                    {user?.role || 'INVESTIGATOR'}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono">
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
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#12304A] text-xs font-medium transition-colors border border-[#CBD5E1]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full flex justify-center p-2 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#F8FAFC]"
            title={`${user?.name || 'Inspector Rajesh Verma'} (${user?.role || 'INVESTIGATOR'})`}
          >
            <User className="w-4 h-4 text-[#087E8B]" />
          </button>
        )}
      </div>
    </aside>
  );
};
