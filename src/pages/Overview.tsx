import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ShieldAlert, 
  Search,
  Sparkles,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';
import { useAuth } from '../context/AuthContext';
import { caseService } from '../services/caseService';
import { alertService } from '../services/alertService';
import { Case, Alert } from '../types';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { ActivityChart } from '../components/dashboard/ActivityChart';

export const Overview: React.FC = () => {
  const { navigateTo, setActiveCaseId, setSelectedEntityId, setSelectedAlertId } = useInvestigation();
  const { user } = useAuth();

  const [cases, setCases] = useState<Case[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      caseService.getCases(),
      alertService.getAlerts()
    ])
      .then(([c, a]) => {
        setCases(c);
        setAlerts(a);
      })
      .catch(err => console.warn('Dashboard data fallback:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const newAlerts = alerts.filter(a => a.status === 'NEW');
  const needsReviewCount = alerts.filter(a => a.status === 'NEW' || a.status === 'INVESTIGATING').length;

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    navigateTo('case-details', { caseId, tab: 'overview' });
  };

  const handleReviewFinding = (entityId: string, alertId?: string) => {
    setSelectedEntityId(entityId);
    if (alertId) setSelectedAlertId(alertId);
    navigateTo('investigate', { entityId, alertId });
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in">
      {/* 1. Officer Morning Greeting Header */}
      <div className="intel-card p-6 bg-gradient-to-r from-[#0f172a] to-[#1e293b] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Good morning, {user?.name || 'Investigator'}
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Here is what needs your analytical attention today across active operational files.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigateTo('investigate')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Search Investigation Data</span>
          </button>
        </div>
      </div>

      {/* 2. Four Clean Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigateTo('cases')}
          className="intel-card intel-card-hover p-4 border border-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Cases</span>
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{cases.length || 4}</div>
          <div className="text-xs text-slate-400 mt-1">Operational dossiers</div>
        </div>

        <div 
          onClick={() => navigateTo('alerts')}
          className="intel-card intel-card-hover p-4 border border-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Needs Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-2">{needsReviewCount || 8}</div>
          <div className="text-xs text-slate-400 mt-1">Actionable anomaly items</div>
        </div>

        <div 
          onClick={() => navigateTo('alerts')}
          className="intel-card intel-card-hover p-4 border border-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">New Alerts</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">{newAlerts.length || 6}</div>
          <div className="text-xs text-slate-400 mt-1">Unassigned findings</div>
        </div>

        <div 
          onClick={() => navigateTo('reports')}
          className="intel-card intel-card-hover p-4 border border-slate-800 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dossiers & Reports</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">12</div>
          <div className="text-xs text-slate-400 mt-1">Prepared briefs</div>
        </div>
      </div>

      {/* 3. Main Actionable Grid: Cases Needing Attention (Left) & Important Findings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cases Needing Attention (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>Cases Needing Attention</span>
            </h3>
            <button 
              onClick={() => navigateTo('cases')}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All ({cases.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 3).map((c) => (
              <div 
                key={c.id}
                className="intel-card p-4 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-blue-400">{c.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-semibold text-sm text-white truncate">{c.name}</span>
                    <PriorityBadge priority={c.priority} size="sm" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span>Lead: <strong>{c.leadInvestigator}</strong></span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">3 unreviewed alerts</span>
                    <span>•</span>
                    <span>Updated {c.lastActivity || 'recently'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenCase(c.id)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Open Case</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Important Findings (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Important Findings</span>
            </h3>
            <button 
              onClick={() => navigateTo('alerts')}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>All Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="intel-card p-4 border border-amber-500/30 bg-amber-950/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                  Cross-Group Bridge
                </span>
                <span className="text-[11px] text-slate-400">Operation Meridian</span>
              </div>
              <div className="font-semibold text-xs text-white">
                Person_044 connects 3 separate network groups
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                7 cross-group relationships detected linking northern distribution, transit logistics, and hawala laundering nodes.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Priority Score: <strong className="text-amber-300">82/100</strong></span>
                <button
                  onClick={() => handleReviewFinding('Person_044', 'ALT-9041')}
                  className="px-3 py-1 rounded bg-amber-600/30 hover:bg-amber-600 border border-amber-500/40 text-amber-200 hover:text-white text-xs font-semibold transition-colors"
                >
                  Review Lead
                </button>
              </div>
            </div>

            <div className="intel-card p-4 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
                  Unusual Transactions
                </span>
                <span className="text-[11px] text-slate-400">Operation Meridian</span>
              </div>
              <div className="font-semibold text-xs text-white">
                Account_103 structured payment velocity
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                6 transactions structured under regulatory compliance limit within 48 hours to 4 unique beneficiaries.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">Priority Score: <strong className="text-blue-300">76/100</strong></span>
                <button
                  onClick={() => handleReviewFinding('Account_103', 'ALT-9044')}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Review Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Single Clean Activity Trend Chart */}
      <div className="intel-card p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Investigation Activity Timeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregated communication intercepts, financial transfers, and investigative updates over the last 14 days.
            </p>
          </div>
        </div>
        <div className="pt-2">
          <ActivityChart />
        </div>
      </div>
    </div>
  );
};
