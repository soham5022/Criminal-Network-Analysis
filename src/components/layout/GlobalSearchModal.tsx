import React, { useState, useEffect } from 'react';
import { Search, X, Users, Phone, CreditCard, MapPin, Building2, Car, Briefcase, ArrowRight, ShieldAlert } from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { mockEntities } from '../../data/mockEntities';
import { mockCases } from '../../data/mockCases';
import { EntityTypeBadge, PriorityBadge } from '../common/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { isOmniSearchOpen, setIsOmniSearchOpen, navigateTo } = useInvestigation();
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
      e.community.toLowerCase().includes(q) ||
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
    setIsOmniSearchOpen(false);
    navigateTo('case-details', { caseId });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl intel-card rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Persons, Phones, Accounts, Locations, Vehicles, Organizations, or Cases..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none font-mono"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            ESC
          </span>
        </div>

        {/* Filter Categories Bar */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'PERSON', label: 'Persons' },
            { id: 'PHONE', label: 'Phones' },
            { id: 'ACCOUNT', label: 'Accounts' },
            { id: 'LOCATION', label: 'Locations' },
            { id: 'ORGANIZATION', label: 'Organizations' },
            { id: 'VEHICLE', label: 'Vehicles' },
            { id: 'CASE', label: 'Cases' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                selectedFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Active Cases Section */}
          {filteredCases.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-cyan-400" />
                <span>Investigations ({filteredCases.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {filteredCases.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCase(c.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/70 border border-transparent hover:border-slate-700 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {c.id}
                          </span>
                          <span className="text-xs text-slate-300 font-medium">
                            {c.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {c.leadInvestigator} • {c.entityCount} Entities • {c.relationshipCount} Links
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={c.priority} size="sm" />
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entities Section */}
          {filteredEntities.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-cyan-400" />
                <span>Extracted Entities ({filteredEntities.length})</span>
              </div>
              <div className="space-y-1 mt-1">
                {filteredEntities.map(e => {
                  const getIcon = () => {
                    switch (e.type) {
                      case 'PERSON': return Users;
                      case 'PHONE': return Phone;
                      case 'ACCOUNT': return CreditCard;
                      case 'LOCATION': return MapPin;
                      case 'ORGANIZATION': return Building2;
                      case 'VEHICLE': return Car;
                    }
                  };
                  const Icon = getIcon();

                  return (
                    <div
                      key={e.id}
                      onClick={() => handleSelectEntity(e.id)}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/70 border border-transparent hover:border-slate-700 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400 border border-slate-700">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {e.id}
                            </span>
                            {e.label !== e.id && (
                              <span className="text-xs text-slate-400">
                                ({e.label})
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-sm">
                            {e.community} • {e.connectionsCount} Connections • Betweenness: {e.betweennessCentrality}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <EntityTypeBadge type={e.type} />
                        <PriorityBadge priority={e.analyticalPriority} />
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredEntities.length === 0 && filteredCases.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm font-medium text-slate-300">No matching investigation entities or cases found</p>
              <p className="text-xs text-slate-400">Try searching by ID (e.g., Person_044, Account_103, CASE-1024) or alias.</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Tip: Press <strong className="text-slate-300">Ctrl + K</strong> anytime to trigger omni-search</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
