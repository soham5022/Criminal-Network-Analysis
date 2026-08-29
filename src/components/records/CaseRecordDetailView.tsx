import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Truck, 
  Network, 
  Clock, 
  Layers, 
  AlertTriangle, 
  Plus, 
  Eye, 
  ExternalLink, 
  FolderArchive, 
  Search,
  Database,
  Printer,
  ChevronRight
} from 'lucide-react';
import { 
  caseRecordsService, 
  CaseRecordItem, 
  CaseDocument, 
  RelatedCaseReference 
} from '../../services/caseRecordsService';
import { useInvestigation } from '../../context/InvestigationContext';
import { DocumentViewerModal } from './DocumentViewerModal';
import { DocumentUploadModal } from './DocumentUploadModal';

interface CaseRecordDetailViewProps {
  caseId: string;
  onBack: () => void;
}

export const CaseRecordDetailView: React.FC<CaseRecordDetailViewProps> = ({ caseId, onBack }) => {
  const { navigateTo, openEntityProfile, setSelectedEntityId, setActiveCaseId } = useInvestigation();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'documents' | 'entities' | 'related' | 'evidence' | 'timeline'
  >('overview');

  const [caseRecord, setCaseRecord] = useState<CaseRecordItem | null>(null);
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [relatedCases, setRelatedCases] = useState<RelatedCaseReference[]>([]);
  
  // Modals state
  const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [docSearch, setDocSearch] = useState<string>('');

  const loadData = () => {
    const record = caseRecordsService.getCaseRecordById(caseId);
    if (record) setCaseRecord(record);

    const docs = caseRecordsService.getDocumentsByCaseId(caseId);
    setDocuments(docs);

    const related = caseRecordsService.getRelatedCases(caseId);
    setRelatedCases(related);
  };

  useEffect(() => {
    loadData();
  }, [caseId]);

  if (!caseRecord) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        Loading case record repository file...
      </div>
    );
  }

  const filteredDocs = documents.filter(d => {
    if (!docSearch.trim()) return true;
    const q = docSearch.toLowerCase();
    return (
      d.id.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.documentType.toLowerCase().includes(q) ||
      d.extractedEntities.some(e => e.label.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">ACTIVE</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">UNDER REVIEW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">CLOSED</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">ROUTINE</span>;
    }
  };

  return (
    <div className="space-y-5 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Records Repository</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Case Document</span>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(caseId);
              navigateTo('network', { caseId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shadow-sm"
          >
            <Network className="w-3.5 h-3.5 text-blue-400" />
            <span>View Case Network</span>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(caseId);
              navigateTo('timeline', { caseId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Timeline</span>
          </button>
        </div>
      </div>

      {/* 2. Main Case File Banner */}
      <div className="intel-card p-6 border border-slate-700/80 bg-[#090f1e] shadow-2xl rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex items-center justify-center flex-shrink-0 shadow-inner text-blue-400">
              <FolderArchive className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
                  {caseRecord.title}
                </h1>
                <span className="font-mono text-xs text-blue-400">({caseRecord.id})</span>
                <span className="font-mono text-xs text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  {caseRecord.firNumber}
                </span>
                {getStatusBadge(caseRecord.status)}
                {getPriorityBadge(caseRecord.priority)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-sans">
                <span>Station: <strong className="text-white">{caseRecord.policeStation}</strong></span>
                <span>•</span>
                <span>IO: <strong className="text-blue-300">{caseRecord.investigatingOfficer}</strong> ({caseRecord.badgeNumber})</span>
                <span>•</span>
                <span className="text-slate-400">Registered: <strong className="text-slate-200 font-mono">{caseRecord.dateRegistered}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#060a14] border border-slate-800 self-start md:self-auto font-mono text-xs text-right">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Repository Scale</div>
              <div className="text-white font-bold text-sm">{documents.length} Case Docs</div>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-sans">Extracted Nodes</div>
              <div className="text-blue-400 font-bold text-sm">{caseRecord.entityCount} Entities</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-800">
        {[
          { id: 'overview' as const, label: '1. Case Overview & Scope' },
          { id: 'documents' as const, label: `2. Case Documents Repository (${documents.length})` },
          { id: 'entities' as const, label: `3. Extracted Persons & Entities (${caseRecord.entityCount})` },
          { id: 'related' as const, label: `4. Related Cases & Correlations (${relatedCases.length})` },
          { id: 'evidence' as const, label: `5. Source Evidence Ledger (${caseRecord.evidenceCount})` },
          { id: 'timeline' as const, label: '6. Case Activity Timeline' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tab Content */}

      {/* TAB 1: OVERVIEW & SCOPE */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="intel-card p-5 border border-slate-800 bg-[#090f1e] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Investigative Scope & Background Narrative
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {caseRecord.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-white">{caseRecord.entityCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Persons / Nodes</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-blue-400">{documents.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Case Documents</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-emerald-400">{caseRecord.evidenceCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Evidence Ledgers</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-purple-400">{caseRecord.locationsCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Locations / ANPR</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-rose-400">{caseRecord.vehiclesCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Vehicles Logged</div>
            </div>

            <div className="p-3 rounded-xl bg-[#090e1a] border border-slate-800 space-y-0.5">
              <div className="text-lg font-bold text-amber-400">{caseRecord.alertsCount}</div>
              <div className="text-[10px] text-slate-400 uppercase font-sans">Alerts Flagged</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS REPOSITORY */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                placeholder="Search case documents by title, ID, or extracted entity..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="intel-card p-5 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all bg-[#090f1e] space-y-3 group"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                    {doc.documentType}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{doc.id}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm group-hover:text-blue-300 font-mono">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-300 font-sans line-clamp-2">{doc.summary}</p>
                </div>

                {/* Extracted Entities Tag Snippet */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-500">Extracted:</span>
                  {doc.extractedEntities.slice(0, 3).map(e => (
                    <span key={e.id} className="text-[10px] font-mono text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {e.id}
                    </span>
                  ))}
                  {doc.extractedEntities.length > 3 && (
                    <span className="text-[10px] font-mono text-slate-500">+{doc.extractedEntities.length - 3} more</span>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>SHA-256: {doc.integrityHash.slice(0, 12)}...</span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:underline">
                    <span>View Record</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXTRACTED PERSONS & ENTITIES */}
      {activeTab === 'entities' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="intel-card p-4 border border-slate-800 bg-[#090e1a] text-xs text-slate-300 flex items-center justify-between">
            <span>Entities indexed and extracted from official case documentation in <strong className="text-white">{caseId}</strong>.</span>
            <span className="text-slate-400 font-mono">Click any entity to open its complete 360° Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
            {['Person_044', 'Person_001', 'Person_078', 'Phone_021', 'Account_103', 'Location_A', 'Vehicle_017', 'Organization_X'].map((entId) => (
              <div
                key={entId}
                onClick={() => openEntityProfile(entId)}
                className="p-4 rounded-xl bg-[#090f1e] border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-white group-hover:text-blue-300">{entId}</strong>
                  <span className="text-[10px] text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold">
                    INDEXED
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Active subject indexed in case records and telecommunication intercepts.
                </div>
                <div className="text-[10px] text-blue-400 flex items-center gap-1 pt-1 group-hover:underline">
                  <span>Open 360° Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RELATED CASES & CROSS-REFERENCES */}
      {activeTab === 'related' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="space-y-3">
            {relatedCases.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No related cases found in the available dataset.
              </div>
            ) : (
              relatedCases.map((rel, idx) => (
                <div
                  key={idx}
                  className="intel-card p-5 border border-slate-800 bg-[#090f1e] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2 font-mono font-bold text-white text-xs">
                        <span>{caseId}</span>
                        <span className="text-blue-400">⟷</span>
                        <span className="text-emerald-400">{rel.caseId}: {rel.caseTitle}</span>
                        <span className="text-slate-400 font-normal">({rel.firNumber})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                        Station: {rel.policeStation}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCaseId(rel.caseId);
                        navigateTo('case-records');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-xs transition-colors self-start sm:self-auto shadow-sm flex items-center gap-1"
                    >
                      <span>Open Case Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-sans">Correlating Shared Entity:</span>
                      <strong 
                        onClick={() => openEntityProfile(rel.sharedEntityId)}
                        className="text-blue-300 hover:underline cursor-pointer"
                      >
                        {rel.sharedEntityId} ({rel.sharedEntityLabel})
                      </strong>
                    </div>
                    <p className="text-slate-300 font-sans text-[11px]">{rel.correlationReason}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SOURCE EVIDENCE LEDGER */}
      {activeTab === 'evidence' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="intel-card border border-slate-800 overflow-hidden shadow-lg font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Evidence ID</th>
                  <th className="py-3 px-4">Source Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">SHA-256 Hash</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {['CDR_00441', 'BANK_00192', 'ANPR_00881', 'FIR_0019'].map((evId, i) => (
                  <tr key={evId} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{evId}</td>
                    <td className="py-3 px-4 text-blue-300">{i % 2 === 0 ? 'CDR Intercept Log' : 'Bank Swift Ledger'}</td>
                    <td className="py-3 px-4 text-slate-300 font-sans text-xs">Verified digital capture matching case records.</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">e3b0c44298fc...</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: CHRONOLOGICAL ACTIVITY TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-3 animate-in fade-in text-xs font-mono">
          {[
            { date: '10 Jun 2026', title: 'FIR Registered', desc: 'Case officially filed under Section 420/120-B IPC.' },
            { date: '18 Jun 2026', title: 'ANPR Intercept at Location_A', desc: 'Vehicle_017 logged at toll checkpoint.' },
            { date: '24 Jul 2026', title: 'CDR Forensic Report Synthesized', desc: 'Betweenness centrality graph analysis completed.' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#090e1a] border border-slate-800 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-white">{item.title}</div>
                <div className="text-[11px] text-slate-400 font-sans">{item.desc}</div>
              </div>
              <span className="text-blue-400 text-[10px] shrink-0 font-bold">{item.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <DocumentViewerModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {/* Document Upload Modal */}
      <DocumentUploadModal
        caseId={caseId}
        firNumber={caseRecord.firNumber}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentAdded={(newDoc) => {
          setDocuments(prev => [newDoc, ...prev]);
        }}
      />

    </div>
  );
};
