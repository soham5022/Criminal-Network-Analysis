import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Download, 
  AlertTriangle, 
  Columns, 
  Info
} from 'lucide-react';
import { WitnessRecord, WitnessStatement } from '../../services/caseHistoryService';

interface StatementViewerModalProps {
  witness: WitnessRecord;
  statement: WitnessStatement;
  allStatements: WitnessStatement[];
  onClose: () => void;
}

export const StatementViewerModal: React.FC<StatementViewerModalProps> = ({
  witness,
  statement,
  allStatements,
  onClose
}) => {
  const [selectedStatementId, setSelectedStatementId] = useState<string>(statement.id);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareWithId, setCompareWithId] = useState<string>(
    allStatements.find(s => s.id !== statement.id)?.id || statement.id
  );

  const activeStatement = allStatements.find(s => s.id === selectedStatementId) || statement;
  const compareStatement = allStatements.find(s => s.id === compareWithId) || statement;

  const handleDownload = (st: WitnessStatement) => {
    const blob = new Blob([st.fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${st.id}_${witness.name.replace(/\s+/g, '_')}_Statement.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-4xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#087E8B]">{activeStatement.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFFFFF] text-[#475569] border border-[#CBD5E1]">
                  Statement #{activeStatement.statementNumber}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">
                  {activeStatement.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#12304A]">
                Witness Statement — {witness.name} (Section 161 CrPC)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allStatements.length > 1 && (
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  compareMode 
                    ? 'bg-[#087E8B] text-white border-[#087E8B]' 
                    : 'bg-[#FFFFFF] text-[#475569] hover:text-[#12304A] border-[#CBD5E1]'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{compareMode ? 'Single View' : 'Compare Statements'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Statement Selector Tabs if multiple statements exist */}
          {allStatements.length > 1 && !compareMode && (
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
              <span className="text-[10px] text-[#64748B] uppercase font-bold">Statements:</span>
              {allStatements.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatementId(st.id)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                    selectedStatementId === st.id
                      ? 'bg-[#087E8B] text-white'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0]'
                  }`}
                >
                  Statement #{st.statementNumber} ({st.date})
                </button>
              ))}
            </div>
          )}

          {/* VIEW MODE 1: SINGLE STATEMENT INSPECTION */}
          {!compareMode && (
            <div className="space-y-4">
              {/* Metadata Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Recording Officer</span>
                  <span className="text-[#12304A] font-semibold">{activeStatement.recordingOfficer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Date & Time</span>
                  <span className="font-mono text-[#17212B]">{activeStatement.date} • {activeStatement.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Location</span>
                  <span className="text-[#17212B]">{activeStatement.location}</span>
                </div>
              </div>

              {/* Inconsistency Review Callout if flagged */}
              {activeStatement.inconsistenciesWithPrevious && activeStatement.inconsistenciesWithPrevious.length > 0 && (
                <div className="p-3.5 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#B7791F] font-bold">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>Investigator Variation Note (Requires Review)</span>
                  </div>
                  {activeStatement.inconsistenciesWithPrevious.map((note, i) => (
                    <p key={i} className="text-[#78350F] leading-relaxed font-sans text-[11px]">
                      {note}
                    </p>
                  ))}
                  <div className="text-[10px] text-[#64748B] italic pt-1 border-t border-[#FCD34D]">
                    Notice: Variations are flagged neutrally to assist investigator cross-examination.
                  </div>
                </div>
              )}

              {/* Full Text Document */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">
                    Certified Statement Deposition Text
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(activeStatement)}
                      className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-2.5 py-1 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] font-mono text-xs text-[#17212B] leading-relaxed whitespace-pre-wrap select-text max-h-72 overflow-y-auto shadow-sm">
                  {activeStatement.fullText}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: SIDE-BY-SIDE STATEMENT COMPARISON */}
          {compareMode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] text-xs flex items-center gap-2 text-[#087E8B]">
                <Info className="w-4 h-4 shrink-0" />
                <span>
                  Side-by-side statement timeline analysis. Review chronological additions or shifts in witness recollections.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                {/* Column 1: Statement A */}
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[#087E8B] font-bold">{activeStatement.id}</span>
                      <div className="font-bold text-[#12304A] text-xs">Statement #{activeStatement.statementNumber}</div>
                    </div>
                    <span className="font-mono text-[10px] text-[#64748B]">{activeStatement.date}</span>
                  </div>

                  <div className="p-2.5 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[11px] text-[#334155] font-sans">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Summary:</span>
                    {activeStatement.summary}
                  </div>

                  <div className="p-3 rounded bg-[#FFFFFF] border border-[#CBD5E1] font-mono text-[11px] text-[#17212B] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {activeStatement.fullText}
                  </div>
                </div>

                {/* Column 2: Statement B */}
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-[#2563A6] font-bold">{compareStatement.id}</span>
                      <div className="font-bold text-[#12304A] text-xs">Statement #{compareStatement.statementNumber}</div>
                    </div>
                    <span className="font-mono text-[10px] text-[#64748B]">{compareStatement.date}</span>
                  </div>

                  <div className="p-2.5 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[11px] text-[#334155] font-sans">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Summary:</span>
                    {compareStatement.summary}
                  </div>

                  <div className="p-3 rounded bg-[#FFFFFF] border border-[#CBD5E1] font-mono text-[11px] text-[#17212B] max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {compareStatement.fullText}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B] font-mono">
            Source: {activeStatement.source}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
