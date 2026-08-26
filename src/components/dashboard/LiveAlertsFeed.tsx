import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { alertService } from '../../services/alertService';
import { Alert } from '../../types';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

export const LiveAlertsFeed: React.FC = () => {
  const { navigateTo, activeCaseId } = useInvestigation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    alertService.getAlerts({ caseId: activeCaseId })
      .then(setAlerts)
      .catch(err => console.warn('Alerts feed fallback:', err))
      .finally(() => setIsLoading(false));
  }, [activeCaseId]);

  return (
    <div className="intel-card p-5 rounded-xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>High-Priority Pattern Alerts</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic anomaly flags requiring investigator assessment.
          </p>
        </div>
        <button
          onClick={() => navigateTo('alerts')}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>View All ({alerts.length}) Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-6 text-center text-xs font-mono text-slate-500">
            Fetching active algorithmic alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-slate-500">
            No active pattern anomaly alerts detected for this case.
          </div>
        ) : (
          alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              onClick={() => navigateTo('alerts', { alertId: alert.id })}
              className="p-3 rounded-lg bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400">{alert.id}</span>
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {alert.title}
                  </span>
                </div>
                <PriorityBadge priority={alert.severity} size="sm" />
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {alert.reason}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-cyan-400">{alert.category}</span>
                  <span>•</span>
                  <span>{alert.timestamp.split('(')[0]}</span>
                </div>
                <span className="text-cyan-400 group-hover:underline flex items-center gap-0.5 text-[11px]">
                  Investigate <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
