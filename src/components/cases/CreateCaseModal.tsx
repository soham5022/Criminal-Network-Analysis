import React, { useState } from 'react';
import { 
  FolderPlus, 
  X, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { caseService } from '../../services/caseService';
import { auditService } from '../../services/auditService';
import { CasePriority } from '../../types';

export const CreateCaseModal: React.FC = () => {
  const { isCreateCaseModalOpen, setIsCreateCaseModalOpen, navigateTo } = useInvestigation();
  const { user } = useAuth();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<CasePriority>('HIGH');
  const [leadInvestigator, setLeadInvestigator] = useState<string>(user?.name || 'Inspector Rajesh Verma');
  const [tagsInput, setTagsInput] = useState<string>('CYBER_FRAUD, FINANCIAL_LAYERING');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCreateCaseModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const newCase = await caseService.createCase({
        name,
        description,
        priority,
        lead_investigator: leadInvestigator,
        tags
      });

      auditService.logAction({
        action: 'CREATED_CASE',
        actionLabel: 'Registered New Case Record',
        module: 'Cases',
        caseId: newCase.id,
        recordId: newCase.id,
        recordType: 'CASE',
        recordLabel: newCase.name,
        status: 'SUCCESS',
        details: `New case ${newCase.id} (${newCase.name}) registered with Priority: ${priority}.`,
        user: user ? {
          id: user.id,
          name: user.name,
          badge_number: user.badge_number,
          role: user.role
        } : undefined
      });

      setIsCreateCaseModalOpen(false);
      navigateTo('case-details', { caseId: newCase.id, tab: 'overview' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create case.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-[#E6F4F5] border border-[#A7DFE3] text-[#087E8B]">
              <FolderPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12304A] uppercase tracking-wider">Initialize New Investigation</h3>
              <p className="text-xs text-[#64748B] font-mono">Special Cyber & Financial Crimes Division</p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateCaseModalOpen(false)}
            className="p-1 rounded-md text-[#64748B] hover:text-[#12304A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs text-[#C24141]">
              <AlertCircle className="w-4 h-4 text-[#C24141] shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Operation / Case Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Operation BlueHawk"
              className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Investigation Objective & Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the operational scope, suspect entities, and multi-source data parameters..."
              className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Priority Rating
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CasePriority)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Lead Investigator
              </label>
              <input
                type="text"
                value={leadInvestigator}
                onChange={(e) => setLeadInvestigator(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] focus:outline-none focus:border-[#087E8B]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Analytical Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. CYBER_FRAUD, ANPR_SURVEILLANCE"
              className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsCreateCaseModalOpen(false)}
              className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Creating Case...' : 'Create Investigation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
