import React, { useState } from 'react';
import { FileText, Building2, ChevronRight } from 'lucide-react';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { StationIntelligenceReportView } from '../components/reports/StationIntelligenceReport';

type ReportMode = 'case' | 'station';

export const Reports: React.FC = () => {
  const [mode, setMode] = useState<ReportMode>('case');

  return (
    <div className="space-y-5">

      {/* Section Selector */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setMode('case')}
            className={`flex items-center gap-3 p-4 text-left transition-all border-r border-[#E2E8F0] ${
              mode === 'case'
                ? 'bg-[#087E8B] text-white'
                : 'bg-[#FFFFFF] text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <FileText className={`w-5 h-5 shrink-0 ${mode === 'case' ? 'text-white' : 'text-[#087E8B]'}`} />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Case Intelligence
              </div>
              <div className={`text-[11px] mt-0.5 ${mode === 'case' ? 'text-white/80' : 'text-[#64748B]'}`}>
                Generate reports for a specific case
              </div>
            </div>
            {mode === 'case' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>

          <button
            onClick={() => setMode('station')}
            className={`flex items-center gap-3 p-4 text-left transition-all ${
              mode === 'station'
                ? 'bg-[#087E8B] text-white'
                : 'bg-[#FFFFFF] text-[#475569] hover:bg-[#F8FAFC]'
            }`}
          >
            <Building2 className={`w-5 h-5 shrink-0 ${mode === 'station' ? 'text-white' : 'text-[#087E8B]'}`} />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Station Intelligence
              </div>
              <div className={`text-[11px] mt-0.5 ${mode === 'station' ? 'text-white/80' : 'text-[#64748B]'}`}>
                Comprehensive station-wide briefing across all cases
              </div>
            </div>
            {mode === 'station' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        </div>
      </div>

      {/* Selected report section */}
      {mode === 'case' ? <ReportGenerator /> : <StationIntelligenceReportView />}

    </div>
  );
};
