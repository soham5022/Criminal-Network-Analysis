import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Network, 
  Clock, 
  Plus, 
  Eye, 
  FolderArchive, 
  Search
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
  const { navigateTo, openEntityProfile, setActiveCaseId } = useInvestigation();

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
      <div className="p-8 text-center text-[#64748B] font-mono">
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
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">ACTIVE</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">UNDER REVIEW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">CLOSED</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">ROUTINE</span>;
    }
  };

  return (
    <div className="space-y-5 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#E2E8F0]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-[#64748B] hover:text-[#12304A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Records Repository</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Case Document</span>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(caseId);
              navigateTo('network', { caseId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#12304A] text-xs font-semibold transition-colors border border-[#CBD5E1] shadow-sm"
          >
            <Network className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>View Case Network</span>
          </button>

          <button
            onClick={() => {
              setActiveCaseId(caseId);
              navigateTo('timeline', { caseId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#12304A] text-xs font-semibold transition-colors border border-[#CBD5E1] shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>View Timeline</span>
          </button>
        </div>
      </div>

      {/* 2. Main Case File Banner */}
      <div className="p-6 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#E6F4F5] border border-[#A7DFE3] flex items-center justify-center flex-shrink-0 shadow-sm text-[#087E8B]">
              <FolderArchive className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#12304A] font-mono tracking-tight">
                  {caseRecord.title}
                </h1>
                <span className="font-mono text-xs text-[#087E8B]">({caseRecord.id})</span>
                <span className="font-mono text-xs text-[#B7791F] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FCD34D]">
                  {caseRecord.firNumber}
                </span>
                {getStatusBadge(caseRecord.status)}
                {getPriorityBadge(caseRecord.priority)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569] font-sans">
                <span>Station: <strong className="text-[#12304A]">{caseRecord.policeStation}</strong></span>
                <span>•</span>
                <span>IO: <strong className="text-[#12304A]">{caseRecord.investigatingOfficer}</strong> ({caseRecord.badgeNumber})</span>
                <span>•</span>
                <span className="text-[#64748B]">Registered: <strong className="text-[#17212B] font-mono">{caseRecord.dateRegistered}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] self-start md:self-auto font-mono text-xs text-right">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] font-sans">Repository Scale</div>
              <div className="text-[#12304A] font-bold text-sm">{documents.length} Case Docs</div>
            </div>
            <span className="text-[#CBD5E1]">|</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] font-sans">Extracted Nodes</div>
              <div className="text-[#087E8B] font-bold text-sm">{caseRecord.entityCount} Entities</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#E2E8F0]">
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
            className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]'
                : 'text-[#64748B] hover:text-[#12304A] hover:bg-[#FFFFFF]'
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
          <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
              Investigative Scope & Background Narrative
            </span>
            <p className="text-xs text-[#334155] leading-relaxed font-sans">
              {caseRecord.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5 text-center">
              <div className="text-lg font-bold text-[#12304A]">{caseRecord.entityCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase font-sans">Persons / Nodes</div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5 text-center">
              <div className="text-lg font-bold text-[#087E8B]">{documents.length}</div>
              <div className="text-[10px] text-[#64748B] uppercase font-sans">Case Documents</div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5 text-center">
              <div className="text-lg font-bold text-[#16805C]">{caseRecord.evidenceCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase font-sans">Evidence Ledgers</div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5 text-center">
              <div className="text-lg font-bold text-[#7E22CE]">{caseRecord.locationsCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase font-sans">Locations / ANPR</div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5 text-center">
              <div className="text-lg font-bold text-[#B7791F]">{caseRecord.vehiclesCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase font-sans">Vehicles Logged</div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5 text-center">
              <div className="text-lg font-bold text-[#C24141]">{caseRecord.alertsCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase font-sans">Alerts Flagged</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS REPOSITORY */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                placeholder="Search case documents by title, ID, or extracted entity..."
                className="w-full pl-9 pr-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
              />
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Document</span>
            </button>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[10px] text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Doc ID & Title</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Officer</th>
                  <th className="py-3.5 px-4">Extracted Entities</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-[#F8FAFC] cursor-pointer bg-[#FFFFFF]" onClick={() => setSelectedDoc(doc)}>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-[#087E8B]">{doc.id}</div>
                      <div className="font-semibold text-[#12304A]">{doc.title}</div>
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">{doc.documentType}</td>
                    <td className="py-3 px-4 font-mono text-[#64748B]">{doc.uploadedDate}</td>
                    <td className="py-3 px-4 text-[#12304A]">{doc.investigatingOfficer}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {doc.extractedEntities.slice(0, 3).map(ent => (
                          <span key={ent.id} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#475569]">
                            {ent.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-2.5 py-1 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white font-semibold text-xs inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ENTITIES */}
      {activeTab === 'entities' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Extracted Entities ({caseRecord.entityCount})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {documents.flatMap(d => d.extractedEntities).slice(0, 9).map((ent, i) => (
              <div
                key={`${ent.id}-${i}`}
                onClick={() => openEntityProfile(ent.id)}
                className="p-3 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] cursor-pointer transition-colors space-y-1"
              >
                <div className="font-bold text-xs text-[#12304A]">{ent.label}</div>
                <div className="text-[10px] text-[#64748B] font-mono">ID: {ent.id} • {ent.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RELATED CASES */}
      {activeTab === 'related' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Correlated & Related Cases ({relatedCases.length})</h3>
          <div className="space-y-3">
            {relatedCases.map(rc => (
              <div key={rc.caseId} className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#087E8B]">{rc.caseId}</span>
                  <span className="text-xs font-semibold text-[#12304A]">{rc.caseTitle}</span>
                </div>
                <p className="text-xs text-[#475569]">{rc.correlationReason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#12304A]">Case Evidence Ledgers ({caseRecord.evidenceCount})</h3>
            <button
              onClick={() => {
                setActiveCaseId(caseId);
                navigateTo('evidence');
              }}
              className="text-xs font-semibold text-[#087E8B] hover:underline"
            >
              Open Central Evidence Registry →
            </button>
          </div>
          <p className="text-xs text-[#64748B]">All digital soft copies and physical evidence seized for case {caseId}.</p>
        </div>
      )}

      {/* TAB 6: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#12304A]">Case Activity & Timeline</h3>
            <button
              onClick={() => {
                setActiveCaseId(caseId);
                navigateTo('timeline', { caseId });
              }}
              className="text-xs font-semibold text-[#087E8B] hover:underline"
            >
              Open Unified Chronology →
            </button>
          </div>
          <p className="text-xs text-[#64748B]">Full chronological audit stream linking all investigation events.</p>
        </div>
      )}

      {/* Modals */}
      {selectedDoc && (
        <DocumentViewerModal
          document={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {isUploadModalOpen && (
        <DocumentUploadModal
          caseId={caseId}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            setIsUploadModalOpen(false);
            loadData();
          }}
        />
      )}

    </div>
  );
};
