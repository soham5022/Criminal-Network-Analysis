import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { caseService } from '../../services/caseService';
import { useInvestigation } from '../../context/InvestigationContext';

export const DemoBanner: React.FC = () => {
  const { activeCaseId, navigateTo } = useInvestigation();
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await caseService.resetDemoCase('CASE-1024');
      setShowNotification(true);
      navigateTo('case-details', { caseId: 'CASE-1024', tab: 'overview' });
      setTimeout(() => setShowNotification(false), 4000);
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <div className="w-full bg-slate-950 border-b border-cyan-500/20 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-slate-400 text-[11px]">
            DEMO ENVIRONMENT: <strong className="text-cyan-300">Synthetic Investigation Data (SIH26189)</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors disabled:opacity-50"
            title="Restore CASE-1024 to known initial demonstration state"
          >
            <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isResetting ? 'Restoring Baseline...' : 'Reset Demo Case'}</span>
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Demo Case CASE-1024 graph, communities, and alerts restored to baseline!</span>
        </div>
      )}
    </>
  );
};
