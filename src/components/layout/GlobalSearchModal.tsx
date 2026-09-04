import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Users, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Car, 
  Folder, 
  FileSpreadsheet, 
  FileText, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { mockEntities } from '../../data/mockEntities';
import { mockCases } from '../../data/mockCases';
import { caseService } from '../../services/caseService';
import { evidenceRegistryService } from '../../services/evidenceRegistryService';
import { caseRecordsService } from '../../services/caseRecordsService';
import { alertService } from '../../services/alertService';
import { Case, Entity, Alert } from '../../types';

interface SearchResultItem {
  id: string;
  category: 'PERSON' | 'PHONE' | 'ACCOUNT' | 'VEHICLE' | 'LOCATION' | 'ORGANIZATION' | 'EVENT' | 'CASE' | 'EVIDENCE' | 'RECORD' | 'ALERT';
  title: string;
  subtitle: string;
  caseId?: string;
  stats?: {
    casesCount?: number;
    relationshipsCount?: number;
    alertsCount?: number;
  };
  details?: string;
  onClick: () => void;
}

export const GlobalSearchModal: React.FC = () => {
  const { 
    isOmniSearchOpen, 
    setIsOmniSearchOpen, 
    navigateTo, 
    setActiveCaseId, 
    openEntityProfile,
    setSelectedEntityId
  } = useInvestigation();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [allCases, setAllCases] = useState<Case[]>(mockCases);
  const [allAlerts, setAllAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (isOmniSearchOpen) {
      caseService.getCases().then(setAllCases).catch(() => setAllCases(mockCases));
      alertService.getAlerts().then(setAllAlerts).catch(() => {});
    }
  }, [isOmniSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOmniSearchOpen(!isOmniSearchOpen);
      }
      if (e.key === 'Escape' && isOmniSearchOpen) {
        setIsOmniSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOmniSearchOpen, setIsOmniSearchOpen]);

  if (!isOmniSearchOpen) return null;

  const q = query.toLowerCase().trim();

  const allEvidence = evidenceRegistryService.getEvidenceList();
  const allRecords = caseRecordsService.getCaseRecords();

  const results: SearchResultItem[] = [];

  // 1. Entities
  mockEntities.forEach((e: Entity) => {
    const match = !q || (
      e.id.toLowerCase().includes(q) ||
      (e.label && e.label.toLowerCase().includes(q)) ||
      (e.name && e.name.toLowerCase().includes(q)) ||
      (e.metadata?.alias && e.metadata.alias.toLowerCase().includes(q)) ||
      (e.metadata?.description && e.metadata.description.toLowerCase().includes(q)) ||
      (e.phone && e.phone.toLowerCase().includes(q)) ||
      (e.accountNumber && e.accountNumber.toLowerCase().includes(q))
    );

    if (match) {
      results.push({
        id: e.id,
        category: e.type,
        title: e.label || e.name || e.id,
        subtitle: `${e.id} • ${e.type} • Community: ${e.community}`,
        caseId: e.associatedCaseIds[0],
        stats: {
          casesCount: e.associatedCaseIds.length,
          relationshipsCount: e.connectionsCount,
          alertsCount: e.relatedAlertsCount || (e.analyticalPriority === 'HIGH' || e.analyticalPriority === 'CRITICAL' ? 2 : 0)
        },
        details: e.metadata?.description,
        onClick: () => {
          setIsOmniSearchOpen(false);
          openEntityProfile(e.id);
        }
      });
    }
  });

  // 2. Cases
  allCases.forEach((c: Case) => {
    const match = !q || (
      c.id.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.leadInvestigator.toLowerCase().includes(q) ||
      (c.department && c.department.toLowerCase().includes(q)) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );

    if (match) {
      results.push({
        id: c.id,
        category: 'CASE',
        title: `${c.id} — ${c.name}`,
        subtitle: `Priority: ${c.priority} • Lead: ${c.leadInvestigator} • ${c.status}`,
        caseId: c.id,
        stats: {
          casesCount: 1,
          relationshipsCount: c.relationshipCount,
          alertsCount: c.flaggedAlertsCount
        },
        details: c.description,
        onClick: () => {
          setActiveCaseId(c.id);
          setIsOmniSearchOpen(false);
          navigateTo('case-details', { caseId: c.id, tab: 'overview' });
        }
      });
    }
  });

  // 3. Evidence
  allEvidence.forEach(ev => {
    const hash = ev.digitalDocument?.integrityHash || '';
    const officer = ev.registeringOfficer || (ev.chainOfCustody?.[0]?.officer) || 'Officer';
    const match = !q || (
      ev.id.toLowerCase().includes(q) ||
      ev.title.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q) ||
      officer.toLowerCase().includes(q) ||
      hash.toLowerCase().includes(q) ||
      ev.caseId.toLowerCase().includes(q)
    );

    if (match) {
      results.push({
        id: ev.id,
        category: 'EVIDENCE',
        title: `${ev.id} — ${ev.title}`,
        subtitle: `Case: ${ev.caseId} • Type: ${ev.evidenceType} • Status: ${ev.status}`,
        caseId: ev.caseId,
        details: `${hash ? `SHA-256: ${hash.slice(0, 16)}... | ` : ''}Officer: ${officer}`,
        onClick: () => {
          setActiveCaseId(ev.caseId);
          setIsOmniSearchOpen(false);
          navigateTo('evidence');
        }
      });
    }
  });

  // 4. Police Records / FIRs
  allRecords.forEach(rec => {
    const match = !q || (
      rec.id.toLowerCase().includes(q) ||
      rec.firNumber.toLowerCase().includes(q) ||
      rec.title.toLowerCase().includes(q) ||
      rec.investigatingOfficer.toLowerCase().includes(q) ||
      rec.policeStation.toLowerCase().includes(q)
    );

    if (match) {
      results.push({
        id: rec.id,
        category: 'RECORD',
        title: `${rec.firNumber} — ${rec.title}`,
        subtitle: `Case: ${rec.id} • Station: ${rec.policeStation} • ${rec.caseType}`,
        caseId: rec.id,
        details: rec.description,
        onClick: () => {
          setActiveCaseId(rec.id);
          setIsOmniSearchOpen(false);
          navigateTo('case-records');
        }
      });
    }
  });

  // 5. Alerts
  allAlerts.forEach(a => {
    const match = !q || (
      a.id.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q)
    );

    if (match) {
      results.push({
        id: a.id,
        category: 'ALERT',
        title: `${a.id} — ${a.title}`,
        subtitle: `Severity: ${a.severity} • Pattern: ${a.category} • Status: ${a.status}`,
        details: a.reason,
        onClick: () => {
          setIsOmniSearchOpen(false);
          navigateTo('alerts', { alertId: a.id });
        }
      });
    }
  });

  // Filter by selected category tab
  const filteredResults = results.filter(r => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'ENTITIES') return ['PERSON', 'PHONE', 'ACCOUNT', 'VEHICLE', 'LOCATION', 'ORGANIZATION', 'EVENT'].includes(r.category);
    if (selectedCategory === 'CASES') return r.category === 'CASE';
    if (selectedCategory === 'EVIDENCE') return r.category === 'EVIDENCE';
    if (selectedCategory === 'RECORDS') return r.category === 'RECORD';
    if (selectedCategory === 'ALERTS') return r.category === 'ALERT';
    return true;
  });

  const getCategoryBadge = (cat: SearchResultItem['category']) => {
    switch (cat) {
      case 'PERSON':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF8FF] text-[#12304A] border border-[#BEE3F8]">PERSON</span>;
      case 'PHONE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">PHONE</span>;
      case 'ACCOUNT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF8FF] text-[#2563A6] border border-[#BEE3F8]">ACCOUNT</span>;
      case 'VEHICLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">VEHICLE</span>;
      case 'LOCATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">LOCATION</span>;
      case 'ORGANIZATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] text-[#234E70] border border-[#C7D2FE]">ORGANIZATION</span>;
      case 'EVENT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#C24141] border border-[#FCA5A5]">EVENT</span>;
      case 'CASE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] text-[#12304A] border border-[#CBD5E1]">CASE FILE</span>;
      case 'EVIDENCE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">EVIDENCE</span>;
      case 'RECORD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8FAFC] text-[#2563A6] border border-[#CBD5E1]">RECORD / FIR</span>;
      case 'ALERT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#C24141] border border-[#FCA5A5]">ALERT</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 p-4 animate-in fade-in duration-150 select-none">
      <div 
        className="w-full max-w-3xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#FFFFFF]">
          <Search className="w-5 h-5 text-[#087E8B] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across Cases, FIRs, Persons, Phones, Accounts, Vehicles, Locations, Events, Evidence, Alerts..."
            className="w-full bg-transparent text-[#12304A] placeholder-[#94A3B8] text-sm focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-[#64748B] hover:text-[#12304A] p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]">
            ESC
          </span>
        </div>

        {/* Category Filters Bar */}
        <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'ALL', label: 'All Authorized Records' },
            { id: 'ENTITIES', label: 'Entities & Events' },
            { id: 'CASES', label: 'Cases' },
            { id: 'EVIDENCE', label: 'Digital Evidence' },
            { id: 'RECORDS', label: 'FIRs & Case Records' },
            { id: 'ALERTS', label: 'Analytical Alerts' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md transition-all font-semibold whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#087E8B] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-[#64748B] space-y-2">
              <Search className="w-8 h-8 text-[#CBD5E1] mx-auto" />
              <div className="text-sm font-semibold text-[#12304A]">No matching intelligence records found</div>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Try searching for names like "Rahul Sharma", cases like "CASE-1024", phones, vehicles, or FIR numbers.
              </p>
            </div>
          ) : (
            filteredResults.slice(0, 35).map((item) => (
              <div
                key={`${item.category}-${item.id}`}
                onClick={item.onClick}
                className="p-3.5 rounded-lg border border-[#E2E8F0] hover:border-[#087E8B] bg-[#FFFFFF] hover:bg-[#F8FAFC] cursor-pointer transition-all shadow-sm group space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {getCategoryBadge(item.category)}
                    <span className="font-bold text-xs text-[#12304A] group-hover:text-[#087E8B] transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#087E8B] group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                {item.stats && (
                  <div className="flex items-center gap-4 text-[11px] font-mono text-[#64748B]">
                    <span><strong className="text-[#12304A]">{item.stats.casesCount || 1}</strong> authorized case association(s)</span>
                    <span>•</span>
                    <span><strong className="text-[#12304A]">{item.stats.relationshipsCount || 0}</strong> relationship(s)</span>
                    {item.stats.alertsCount !== undefined && (
                      <>
                        <span>•</span>
                        <span className={item.stats.alertsCount > 0 ? 'text-[#C24141] font-bold' : ''}>
                          {item.stats.alertsCount} alert(s)
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="text-xs text-[#475569] flex items-center justify-between gap-2">
                  <span className="truncate">{item.subtitle}</span>
                  {item.caseId && (
                    <span className="text-[10px] font-mono font-bold text-[#087E8B] shrink-0">
                      Scope: {item.caseId}
                    </span>
                  )}
                </div>

                {item.details && (
                  <p className="text-[11px] text-[#64748B] line-clamp-1 border-t border-[#F1F5F9] pt-1">
                    {item.details}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
          <span>{filteredResults.length} authorized match(es)</span>
          <span>TraceNet Multi-Agency Intelligence Search • SIH26189</span>
        </div>
      </div>
    </div>
  );
};
