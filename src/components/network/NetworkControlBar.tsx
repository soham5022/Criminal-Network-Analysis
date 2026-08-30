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
    { type: 'PERSON', label: 'Persons', icon: Users, color: 'text-[#12304A]' },
    { type: 'PHONE', label: 'Phones', icon: Phone, color: 'text-[#087E8B]' },
    { type: 'ACCOUNT', label: 'Accounts', icon: CreditCard, color: 'text-[#2563A6]' },
    { type: 'LOCATION', label: 'Locations', icon: MapPin, color: 'text-[#7E22CE]' },
    { type: 'ORGANIZATION', label: 'Orgs', icon: Building2, color: 'text-[#234E70]' },
    { type: 'VEHICLE', label: 'Vehicles', icon: Car, color: 'text-[#B7791F]' }
  ];

  return (
    <div className="bg-[#FFFFFF] p-3 rounded-lg border border-[#E2E8F0] shadow-sm space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Entity Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter entities (e.g. Person_044, Account_103)..."
            className="w-full pl-9 pr-8 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#12304A]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Community Cluster Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#64748B] font-mono text-[11px] hidden sm:inline">Cluster:</span>
          <select
            value={selectedCommunity}
            onChange={(e) => onCommunityChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
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
          <span className="text-[#64748B] font-mono text-[11px] hidden md:inline">Min Confidence:</span>
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.05"
            value={minConfidence}
            onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
            className="w-24 h-1 bg-[#CBD5E1] rounded-lg appearance-none cursor-pointer accent-[#087E8B]"
          />
          <span className="font-mono text-[#087E8B] font-bold w-8">{minConfidence.toFixed(2)}</span>
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-xs font-mono text-[#64748B] hover:text-[#12304A] transition-colors"
          title="Reset All Graph Filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Entity Type Toggle Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E2E8F0]">
        <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mr-1">Types:</span>
        {entityTypeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedEntityTypes.includes(opt.type);
          return (
            <button
              key={opt.type}
              onClick={() => onToggleEntityType(opt.type)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                isSelected
                  ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3] font-bold shadow-sm'
                  : 'bg-[#FFFFFF] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#12304A]'
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
