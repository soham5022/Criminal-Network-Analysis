import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Share2, 
  Users, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  FolderPlus,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useInvestigation, AppPage } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentPage, navigateTo, setIsCreateCaseModalOpen } = useInvestigation();
  const { canEdit, canViewAudit } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navItems: { id: AppPage; label: string; icon: React.ElementType; badge?: string; badgeColor?: string; adminOnly?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: Briefcase, badge: '4 Active' },
    { id: 'network', label: 'Network Analysis', icon: Share2 },
    { id: 'entities', label: 'Entities', icon: Users, badge: '1,284' },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: '6', badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    { id: 'reports', label: 'Reports', icon: FileText },
    ...(canViewAudit ? [{ id: 'audit' as AppPage, label: 'Audit Trail', icon: ShieldCheck }] : [])
  ];

  return (
    <aside 
      className={`relative flex flex-col border-r border-slate-800 bg-[#080d18] transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] flex-shrink-0">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-extrabold tracking-wider text-base text-white">NEXUS</span>
                <span className="font-mono font-light tracking-widest text-base text-cyan-400">INTEL</span>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 truncate">
                Investigation AI
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* New Case Button */}
      {canEdit && (
        <div className="p-3 border-b border-slate-800/60">
          <button
            onClick={() => setIsCreateCaseModalOpen(true)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/50 hover:to-cyan-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(99,102,241,0.15)] ${
              isCollapsed ? 'px-2' : 'px-3'
            }`}
            title="Create New Case"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            {!isCollapsed && <span>New Case</span>}
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/25 to-cyan-600/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_8px_#00f0ff]" />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!isCollapsed && item.badge && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Classification Notice */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[10px] font-mono text-slate-500">
        {!isCollapsed ? (
          <div>
            <div className="text-slate-400 font-bold">MHA CYBER CELL</div>
            <div>RESTRICTED LEA PROTOTYPE</div>
          </div>
        ) : (
          <div className="text-center font-bold text-slate-400">LEA</div>
        )}
      </div>
    </aside>
  );
};
