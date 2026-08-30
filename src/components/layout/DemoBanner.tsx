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
      <div className="w-full bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs select-none shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#087E8B]" />
          <span className="text-[#64748B] text-[11px]">
            SIH PROTOTYPE: <strong className="text-[#12304A]">TraceNet — AI-Powered Criminal Network Analysis System (SIH26189)</strong>
          </span>
          <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
            SYNTHETIC DEMO ENVIRONMENT
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[11px] text-[#475569] hover:text-[#12304A] transition-colors disabled:opacity-50"
            title="Restore CASE-1024 to known initial demonstration state"
          >
            <RotateCcw className={`w-3 h-3 text-[#087E8B] ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Restoring Baseline...' : 'Reset Demo Case'}</span>
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 p-3.5 rounded-lg bg-[#E8F7F0] border border-[#A3E0C8] text-[#16805C] text-xs shadow-lg flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#16805C]" />
          <span>Demo Case CASE-1024 restored to baseline!</span>
        </div>
      )}
    </>
  );
};
