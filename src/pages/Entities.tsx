import React, { useState } from 'react';
import { Users, GitMerge, AlertCircle } from 'lucide-react';
import { EntitiesTable } from '../components/entities/EntitiesTable';
import { IdentityResolutionView } from '../components/entities/IdentityResolutionView';
import { identityResolutionService } from '../services/identityResolutionService';

export const Entities: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'resolution'>('directory');
  const pendingCount = identityResolutionService.getPendingCount();

  return (
    <div className="space-y-5">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 text-xs font-semibold select-none">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all ${
            activeTab === 'directory'
              ? 'bg-[#087E8B] text-white shadow-sm font-bold'
              : 'bg-[#FFFFFF] text-[#64748B] hover:text-[#12304A] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Central Entity Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('resolution')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md transition-all ${
            activeTab === 'resolution'
              ? 'bg-[#087E8B] text-white shadow-sm font-bold'
              : 'bg-[#FFFFFF] text-[#64748B] hover:text-[#12304A] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
          }`}
        >
          <GitMerge className="w-4 h-4" />
          <span>Identity Resolution & Conflicts</span>
          {pendingCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'resolution'
                ? 'bg-white text-[#087E8B]'
                : 'bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]'
            }`}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'directory' ? <EntitiesTable /> : <IdentityResolutionView />}
    </div>
  );
};
