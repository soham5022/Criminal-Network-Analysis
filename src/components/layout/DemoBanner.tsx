import React, { useState } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { caseService } from '../../services/caseService';
import { useInvestigation } from '../../context/InvestigationContext';

export const DemoBanner: React.FC = () => {
  const { navigateTo } = useInvestigation();
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
      <div className="w-full bg-[#080d17] border-b border-slate-800 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-slate-400 text-[11px]">
            SIH PROTOTYPE: <strong className="text-slate-300">TraceNet — AI-Powered Criminal Network Analysis System (SIH26189)</strong>
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            SYNTHETIC DEMO ENVIRONMENT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Restore CASE-1024 to known initial demonstration state"
          >
            <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin text-blue-400' : ''}`} />
            <span>{isResetting ? 'Restoring Baseline...' : 'Reset Demo Case'}</span>
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Demo Case CASE-1024 restored to baseline!</span>
        </div>
      )}
    </>
  );
};
