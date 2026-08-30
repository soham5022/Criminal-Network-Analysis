import React, { useState, useEffect } from 'react';
import { Search, X, Users, Phone, CreditCard, MapPin, Building2, Car, Briefcase, ArrowRight, ShieldAlert, Folder } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { mockEntities } from '../../data/mockEntities';
import { mockCases } from '../../data/mockCases';
import { EntityTypeBadge, PriorityBadge } from '../common/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isOmniSearchOpen, setIsOmniSearchOpen, navigateTo, setActiveCaseId, openEntityProfile } = useInvestigation();
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

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

  const filteredEntities = mockEntities.filter(e => {
    if (selectedFilter !== 'ALL' && e.type !== selectedFilter) return false;
    if (!q) return true;
    return (
      e.id.toLowerCase().includes(q) ||
      e.label.toLowerCase().includes(q) ||
      String(e.community).toLowerCase().includes(q) ||
      (e.metadata.alias && e.metadata.alias.toLowerCase().includes(q)) ||
      (e.metadata.description && e.metadata.description.toLowerCase().includes(q))
    );
  });

  const filteredCases = (selectedFilter === 'ALL' || selectedFilter === 'CASE') 
    ? mockCases.filter(c => {
        if (!q) return true;
        return (
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.leadInvestigator.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSelectEntity = (entityId: string) => {
    setIsOmniSearchOpen(false);
    openEntityProfile(entityId);
  };

  const handleSelectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setIsOmniSearchOpen(false);
    navigateTo('case-details', { caseId, tab: 'overview' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150 select-none">
      <div 
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center gap-3 bg-[#FFFFFF]">
          <Search className="w-5 h-5 text-[#087E8B] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Persons, Phones, Accounts, Locations, Vehicles, Organizations, or Cases..."
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

        {/* Filter Categories Bar */}
        <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'CASE', label: 'Cases' },
            { id: 'PERSON', label: 'Persons' },
            { id: 'PHONE', label: 'Phones' },
            { id: 'ACCOUNT', label: 'Accounts' },
            { id: 'LOCATION', label: 'Locations' },
            { id: 'ORGANIZATION', label: 'Organizations' },
            { id: 'VEHICLE', label: 'Vehicles' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedFilter(item.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === item.id
                  ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]'
                  : 'text-[#64748B] hover:text-[#12304A] hover:bg-[#FFFFFF]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Results Scroll Area */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Cases Results */}
          {filteredCases.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 px-1">
                <Folder className="w-3.5 h-3.5 text-[#087E8B]" />
                <span>Investigation Cases ({filteredCases.length})</span>
              </div>
              <div className="space-y-1">
                {filteredCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c.id)}
                    className="p-3 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer flex items-center justify-between transition-colors group shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#087E8B]">{c.id}</span>
                        <span className="font-bold text-xs text-[#12304A] group-hover:text-[#087E8B]">{c.name}</span>
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-1">{c.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#087E8B] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entities Results */}
          {filteredEntities.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 px-1">
                <Users className="w-3.5 h-3.5 text-[#2563A6]" />
                <span>Entities & Leads ({filteredEntities.length})</span>
              </div>
              <div className="space-y-1">
                {filteredEntities.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => handleSelectEntity(e.id)}
                    className="p-3 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#E2E8F0] cursor-pointer flex items-center justify-between transition-colors group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#12304A] group-hover:text-[#087E8B]">
                            {e.label || e.name || e.id}
                          </span>
                          <span className="font-mono text-[10px] text-[#64748B]">ID: {e.id}</span>
                          <EntityTypeBadge type={e.type} />
                        </div>
                        <p className="text-[11px] text-[#64748B]">
                          {e.metadata.alias || e.metadata.description || 'Primary investigation entity record'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#087E8B] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCases.length === 0 && filteredEntities.length === 0 && (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No entities or cases match "{query}". Try searching by FIR, name, phone, or account number.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>TraceNet Global Intelligence Registry</span>
          <span className="font-mono">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
