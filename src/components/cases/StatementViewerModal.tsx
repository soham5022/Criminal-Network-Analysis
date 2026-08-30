import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Columns, 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck,
  Eye,
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div 
        className="w-full max-w-4xl intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-400">{activeStatement.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Statement #{activeStatement.statementNumber}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {activeStatement.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Witness Statement — {witness.name} (Section 161 CrPC)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allStatements.length > 1 && (
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  compareMode 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{compareMode ? 'Single View' : 'Compare Statements'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* Statement Selector Tabs if multiple statements exist */}
          {allStatements.length > 1 && !compareMode && (
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Statements:</span>
              {allStatements.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatementId(st.id)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                    selectedStatementId === st.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-[#090e1a] border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Recording Officer</span>
                  <span className="text-white font-medium">{activeStatement.recordingOfficer}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Date & Time</span>
                  <span className="font-mono text-slate-300">{activeStatement.date} • {activeStatement.time}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Location</span>
                  <span className="text-slate-300">{activeStatement.location}</span>
                </div>
              </div>

              {/* Inconsistency Review Callout if flagged */}
              {activeStatement.inconsistenciesWithPrevious && activeStatement.inconsistenciesWithPrevious.length > 0 && (
                <div className="p-3.5 rounded-lg bg-amber-950/25 border border-amber-500/40 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Investigator Variation Note (Requires Review)</span>
                  </div>
                  {activeStatement.inconsistenciesWithPrevious.map((note, i) => (
                    <p key={i} className="text-amber-200/90 leading-relaxed font-sans text-[11px]">
                      {note}
                    </p>
                  ))}
                  <div className="text-[10px] text-slate-400 italic pt-1 border-t border-amber-500/20">
                    Notice: Variations are flagged neutrally to assist investigator cross-examination.
                  </div>
                </div>
              )}

              {/* Full Text Document */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Certified Statement Deposition Text
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(activeStatement)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-text max-h-72 overflow-y-auto">
                  {activeStatement.fullText}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: SIDE-BY-SIDE STATEMENT COMPARISON */}
          {compareMode && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 text-xs flex items-center gap-2 text-blue-300">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  Side-by-side statement timeline analysis. Review chronological additions or shifts in witness recollections.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Column 1: Statement A */}
                <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-blue-400 font-bold">{activeStatement.id}</span>
                      <div className="font-bold text-white text-xs">Statement #{activeStatement.statementNumber}</div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{activeStatement.date}</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-sans">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Summary:</span>
                    {activeStatement.summary}
                  </div>

                  <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {activeStatement.fullText}
                  </div>
                </div>

                {/* Column 2: Statement B */}
                <div className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="space-y-0.5">
                      <span className="font-mono text-cyan-400 font-bold">{compareStatement.id}</span>
                      <div className="font-bold text-white text-xs">Statement #{compareStatement.statementNumber}</div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{compareStatement.date}</span>
                  </div>

                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-sans">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Summary:</span>
                    {compareStatement.summary}
                  </div>

                  <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-200 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {compareStatement.fullText}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Source: {activeStatement.source}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
