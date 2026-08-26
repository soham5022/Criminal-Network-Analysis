import React from 'react';
import { 
  Search, 
  Users, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Car,
  RotateCcw,
  X
} from 'lucide-react';
import { EntityType } from '../../types';

interface NetworkControlBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEntityTypes: EntityType[];
  onToggleEntityType: (type: EntityType) => void;
  selectedCommunity: string;
  onCommunityChange: (community: string) => void;
  minConfidence: number;
  onConfidenceChange: (confidence: number) => void;
  onResetFilters: () => void;
}

export const NetworkControlBar: React.FC<NetworkControlBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedEntityTypes,
  onToggleEntityType,
  selectedCommunity,
  onCommunityChange,
  minConfidence,
  onConfidenceChange,
  onResetFilters
}) => {
  const entityTypeOptions: { type: EntityType; label: string; icon: React.ElementType; color: string }[] = [
    { type: 'PERSON', label: 'Persons', icon: Users, color: 'text-cyan-400' },
    { type: 'PHONE', label: 'Phones', icon: Phone, color: 'text-emerald-400' },
    { type: 'ACCOUNT', label: 'Accounts', icon: CreditCard, color: 'text-amber-400' },
    { type: 'LOCATION', label: 'Locations', icon: MapPin, color: 'text-purple-400' },
    { type: 'ORGANIZATION', label: 'Orgs', icon: Building2, color: 'text-indigo-400' },
    { type: 'VEHICLE', label: 'Vehicles', icon: Car, color: 'text-rose-400' }
  ];

  return (
    <div className="intel-card p-3 rounded-xl border border-slate-800 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Entity Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter entities (e.g. Person_044, Account_103)..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Community Cluster Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">Cluster:</span>
          <select
            value={selectedCommunity}
            onChange={(e) => onCommunityChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Communities</option>
            <option value="Cluster 01">Cluster 01 (Executive Ring)</option>
            <option value="Cluster 02">Cluster 02 (Dispatch Grid)</option>
            <option value="Cluster 03">Cluster 03 (Logistics Hub)</option>
            <option value="Cluster 04">Cluster 04 (Front Shells)</option>
            <option value="Cluster 05">Cluster 05 (Maritime Transit)</option>
          </select>
        </div>

        {/* Confidence Threshold Slider */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px] hidden md:inline">Min Confidence:</span>
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.05"
            value={minConfidence}
            onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
            className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="font-mono text-cyan-300 w-8">{minConfidence.toFixed(2)}</span>
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
          title="Reset All Graph Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Entity Type Toggle Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">Types:</span>
        {entityTypeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedEntityTypes.includes(opt.type);
          return (
            <button
              key={opt.type}
              onClick={() => onToggleEntityType(opt.type)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-slate-800 text-white border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-3 h-3 ${opt.color}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
