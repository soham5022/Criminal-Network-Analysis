import React from 'react';
import { Briefcase, ArrowRight, Clock } from 'lucide-react';
import { mockCases } from '../../data/mockCases';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { useInvestigation } from '../../context/InvestigationContext';

export const RecentCasesTable: React.FC = () => {
  const { navigateTo } = useInvestigation();

  return (
    <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#087E8B]" />
            <span>Active Investigations</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time multi-agency operations under active network graph synthesis.
          </p>
        </div>
        <button
          onClick={() => navigateTo('cases')}
          className="text-xs font-semibold text-[#087E8B] hover:text-[#06636E] flex items-center gap-1 transition-colors"
        >
          <span>View All Cases</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
              <th className="py-3 px-4">Case ID</th>
              <th className="py-3 px-4">Operation Name</th>
              <th className="py-3 px-4">Lead Investigator</th>
              <th className="py-3 px-4 text-center">Priority</th>
              <th className="py-3 px-4 text-right">Entities</th>
              <th className="py-3 px-4 text-right">Links</th>
              <th className="py-3 px-4">Last Activity</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {mockCases.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigateTo('case-details', { caseId: c.id })}
                className="hover:bg-[#F8FAFC] cursor-pointer transition-colors group bg-[#FFFFFF]"
              >
                <td className="py-3.5 px-4 font-mono font-bold text-[#087E8B] group-hover:underline">
                  {c.id}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-[#12304A] group-hover:text-[#087E8B] transition-colors">
                    {c.name}
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate max-w-xs font-mono">
                    {c.codeName}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[#334155]">
                  <div>{c.leadInvestigator}</div>
                  <div className="text-[10px] text-[#64748B] font-mono">{c.department}</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <PriorityBadge priority={c.priority} />
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#12304A]">
                  {c.entityCount}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#64748B]">
                  {c.relationshipCount}
                </td>
                <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#64748B] flex-shrink-0" />
                    <span>{c.lastActivity}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('case-details', { caseId: c.id });
                    }}
                    className="p-1.5 rounded-md bg-[#E6F4F5] hover:bg-[#087E8B] text-[#087E8B] hover:text-white border border-[#A7DFE3] transition-colors inline-flex items-center gap-1 text-[11px] font-semibold shadow-sm"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
