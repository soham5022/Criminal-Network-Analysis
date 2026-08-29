import React, { useState, useEffect } from 'react';
import { Search, X, Users, Phone, CreditCard, MapPin, Building2, Car, Briefcase, ArrowRight, ShieldAlert } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { mockEntities } from '../../data/mockEntities';
import { mockCases } from '../../data/mockCases';
import { EntityTypeBadge, PriorityBadge } from '../common/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isOmniSearchOpen, setIsOmniSearchOpen, navigateTo, setActiveCaseId } = useInvestigation();
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
    navigateTo('network', { entityId });
  };

  const handleSelectCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setIsOmniSearchOpen(false);
    navigateTo('case-details', { caseId });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150 select-none">
      <div 
        className="w-full max-w-2xl intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#090e1a]">
          <Search className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Persons, Phones, Accounts, Locations, Vehicles, Organizations, or Cases..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
        </div>

        {/* Filter Categories Bar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'PERSON', label: 'Persons' },
            { id: 'PHONE', label: 'Phones' },
            { id: 'ACCOUNT', label: 'Accounts' },
            { id: 'LOCATION', label: 'Locations' },
            { id: 'ORGANIZATION', label: 'Organizations' },
            { id: 'VEHICLE', label: 'Vehicles' },
            { id: 'CASE', label: 'Cases' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-3 overflow-y-auto max-h-[60vh] space-y-4 text-xs">
          
          {/* Cases Results */}
          {filteredCases.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                Cases ({filteredCases.length})
              </span>
              <div className="space-y-1">
                {filteredCases.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c.id)}
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-mono font-bold text-blue-400">{c.id}: {c.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{c.description}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entities Results */}
          {filteredEntities.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                Entities ({filteredEntities.length})
              </span>
              <div className="space-y-1">
                {filteredEntities.slice(0, 15).map(ent => (
                  <div
                    key={ent.id}
                    onClick={() => handleSelectEntity(ent.id)}
                    className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <EntityTypeBadge type={ent.type} />
                      <div>
                        <div className="font-mono font-bold text-white text-xs">{ent.label || ent.name || ent.id}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {ent.id} {ent.metadata?.alias ? `• ${ent.metadata.alias}` : ''}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{ent.connectionsCount} links</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCases.length === 0 && filteredEntities.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching cases or entities found for "{query}".
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
