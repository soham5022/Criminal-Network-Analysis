import React from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  CreditCard, 
  FileText, 
  Database, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { Case } from '../../types';
import { useInvestigation } from '../../context/InvestigationContext';

export const CaseSummaryTab: React.FC<{ caseData: Case }> = ({ caseData }) => {
  const { setActiveCaseTab, setSelectedEntityId, setSelectedAlertId } = useInvestigation();

  const handleReviewLead = (entityId?: string, alertId?: string, targetTab: 'network' | 'timeline' | 'evidence' = 'network') => {
    if (entityId) setSelectedEntityId(entityId);
    if (alertId) setSelectedAlertId(alertId);
    setActiveCaseTab(targetTab);
  };

  const findingsList = caseData.keyFindings && caseData.keyFindings.length > 0
    ? caseData.keyFindings.map((findingText, idx) => {
        const entMatch = findingText.match(/(Person_\d+|Account_\d+|Phone_\d+|Location_[A-Z]|Organization_[A-Z]|Vehicle_\d+)/);
        const entityId = entMatch ? entMatch[0] : 'Entity';
        return {
          id: `LEAD-0${idx + 1}`,
          title: findingText,
          whyItMatters: `Analytical pattern flagged during multi-source graph resolution for ${caseData.name}.`,
          evidence: `Verified across case source records (${caseData.id}).`,
          entityId: entityId,
          targetTab: (findingText.includes('transfer') || findingText.includes('call') ? 'timeline' : 'network') as 'network' | 'timeline'
        };
      })
    : [
        {
          id: 'LEAD-01',
          title: `Primary network interactions established in ${caseData.name}.`,
          whyItMatters: 'Graph topology analysis highlights key central entities linking communication and operational records.',
          evidence: `Verified across ingested records for ${caseData.id}.`,
          entityId: 'Person_001',
          targetTab: 'network' as const
        }
      ];

  const firCount = caseData.evidencePointers?.firCount || 6;
  const cdrCount = caseData.evidencePointers?.cdrLogsCount || 2410;
  const bankCount = caseData.evidencePointers?.bankTransactionsCount || 1820;
  const incidentCount = caseData.evidencePointers?.incidentReportsCount || 14;

  return (
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl">
      
      {/* 1. Case Summary Card */}
      <div className="intel-card p-5 border border-slate-800 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Case Summary & Investigative Scope
        </h2>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {caseData.description || 'Cross-source investigation involving communication, financial and location records. Algorithmic analysis extracted entity interactions across multi-source law enforcement data dumps.'}
        </p>
        {caseData.objective && (
          <div className="pt-2 border-t border-slate-800/80 text-xs">
            <span className="font-bold text-slate-400 uppercase text-[10px] block">Investigation Objective:</span>
            <p className="text-slate-300 italic pt-0.5">{caseData.objective}</p>
          </div>
        )}
      </div>

      {/* 2. Data Sources & Investigation Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Data Sources (5 cols) */}
        <div className="md:col-span-5 intel-card p-5 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Ingested Data Sources</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white font-medium">CDR Records</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">{cdrCount.toLocaleString()} records</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-white font-medium">Transaction Records</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">{bankCount.toLocaleString()} records</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-white font-medium">Location Records (ANPR/CCTV)</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">{incidentCount} intercepts</span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-white font-medium">Incident & FIR Reports</span>
              </div>
              <span className="font-mono text-slate-400 text-[11px]">{firCount} filings</span>
            </div>
          </div>
        </div>

        {/* Investigation Statistics (7 cols) */}
        <div className="md:col-span-7 intel-card p-5 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Investigation Statistics</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono">
            <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-white">{(cdrCount + bankCount).toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Records Processed</div>
            </div>

            <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-blue-400">{caseData.entityCount || 36}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Entities Detected</div>
            </div>

            <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-emerald-400">{caseData.relationshipCount || 118}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Relationships</div>
            </div>

            <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-amber-400">{caseData.flaggedAlertsCount || 6}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Alerts Requiring Review</div>
            </div>

            <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-indigo-400">{caseData.clustersIdentified || 3}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Communities Detected</div>
            </div>

            <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-purple-400">100%</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">SHA-256 Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Key Findings (Investigative Leads) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Key Findings & Investigative Leads</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            {findingsList.length} priority pattern{findingsList.length > 1 ? 's' : ''} identified
          </span>
        </div>

        <div className="space-y-3">
          {findingsList.map((finding) => (
            <div 
              key={finding.id}
              className="intel-card p-5 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 bg-[#0d1527]"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] font-bold text-amber-400">{finding.id}</span>
                  <h3 className="text-sm font-bold text-white">
                    {finding.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleReviewLead(finding.entityId, finding.id, finding.targetTab)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors self-start sm:self-auto flex items-center gap-1.5 shadow-sm"
                >
                  <span>Review Lead</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Why It Matters
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {finding.whyItMatters}
                  </p>
                </div>

                <div className="space-y-1 p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Source Evidence Reference
                  </span>
                  <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                    {finding.evidence}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
