import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, ChevronRight } from 'lucide-react';
import { alertService } from '../../services/alertService';
import { Alert } from '../../types';
import { PriorityBadge } from '../common/Badge';
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
    <div className="bg-[#FFFFFF] p-5 rounded-lg border border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#B7791F]" />
            <span>High-Priority Pattern Alerts</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Algorithmic anomaly flags requiring investigator assessment.
          </p>
        </div>
        <button
          onClick={() => navigateTo('alerts')}
          className="text-xs font-semibold text-[#087E8B] hover:text-[#06636E] flex items-center gap-1 transition-colors"
        >
          <span>View All ({alerts.length}) Alerts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-6 text-center text-xs font-mono text-[#64748B]">
            Fetching active algorithmic alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-6 text-center text-xs font-mono text-[#64748B]">
            No active pattern anomaly alerts detected for this case.
          </div>
        ) : (
          alerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              onClick={() => navigateTo('alerts', { alertId: alert.id })}
              className="p-3 rounded-md bg-[#F8FAFC] hover:bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#087E8B] cursor-pointer transition-all space-y-2 group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C24141]">{alert.id}</span>
                  <span className="text-xs font-bold text-[#12304A] group-hover:text-[#087E8B] transition-colors">
                    {alert.title}
                  </span>
                </div>
                <PriorityBadge priority={alert.severity} size="sm" />
              </div>

              <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                {alert.reason}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#087E8B]">{alert.category}</span>
                  <span>•</span>
                  <span>{alert.timestamp.split('(')[0]}</span>
                </div>
                <span className="text-[#087E8B] group-hover:underline flex items-center gap-0.5 text-[11px] font-semibold">
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
