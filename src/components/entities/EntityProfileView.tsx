import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  CreditCard, 
  MapPin, 
  Building2, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  Search, 
  Network, 
  Clock, 
  Layers
} from 'lucide-react';
import { EntityType } from '../../types';
import { useInvestigation } from '../../context/InvestigationContext';
import { useAuth } from '../../context/AuthContext';
import { entityProfileService, EntityDossier } from '../../services/entityProfileService';
import { noteService, Note } from '../../services/noteService';
import { IdentityResolutionTab } from '../identity/IdentityResolutionTab';

interface EntityProfileViewProps {
  entityId: string;
  onClose?: () => void;
}

export const EntityProfileView: React.FC<EntityProfileViewProps> = ({ entityId, onClose }) => {
  const { activeCaseId, navigateTo, setSelectedEntityId } = useInvestigation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'identity' | 'resolution' | 'financial' | 'telecom' | 'logistics' | 'relationships' | 'timeline_evidence' | 'notes'
  >('overview');

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [profileSearch, setProfileSearch] = useState<string>('');
  
  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);

  // Generate dynamic 360 profile
  const dossier = useMemo<EntityDossier>(() => {
    return entityProfileService.get360Profile(entityId, activeCaseId);
  }, [entityId, activeCaseId]);

  // Load notes for this entity
  React.useEffect(() => {
    noteService.getNotes(activeCaseId, entityId)
      .then(setNotes)
      .catch(() => {});
  }, [activeCaseId, entityId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setIsSavingNote(true);
    try {
      const added = await noteService.addNote(activeCaseId, newNoteContent.trim(), entityId);
      setNotes(prev => [added, ...prev]);
      setNewNoteContent('');
    } catch (err) {
      console.warn('Failed to add note:', err);
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleNavigateEntity = (targetId: string) => {
    setSelectedEntityId(targetId);
  };

  const getTypeIcon = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return <User className="w-5 h-5 text-[#12304A]" />;
      case 'PHONE': return <Phone className="w-5 h-5 text-[#087E8B]" />;
      case 'ACCOUNT': return <CreditCard className="w-5 h-5 text-[#2563A6]" />;
      case 'LOCATION': return <MapPin className="w-5 h-5 text-[#7E22CE]" />;
      case 'ORGANIZATION': return <Building2 className="w-5 h-5 text-[#234E70]" />;
      case 'VEHICLE': return <Truck className="w-5 h-5 text-[#B7791F]" />;
      default: return <User className="w-5 h-5 text-[#12304A]" />;
    }
  };

  const getTypeBadge = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return 'bg-[#EBF8FF] text-[#12304A] border-[#BEE3F8]';
      case 'PHONE': return 'bg-[#E6F4F5] text-[#087E8B] border-[#A7DFE3]';
      case 'ACCOUNT': return 'bg-[#EBF8FF] text-[#2563A6] border-[#BEE3F8]';
      case 'LOCATION': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]';
      case 'ORGANIZATION': return 'bg-[#E6F4F5] text-[#234E70] border-[#A7DFE3]';
      case 'VEHICLE': return 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]';
      default: return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="space-y-5 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#E2E8F0]">
        <button
          onClick={() => {
            if (onClose) onClose();
            else navigateTo('case-details', { tab: 'entities' });
          }}
          className="flex items-center gap-2 text-xs font-mono text-[#64748B] hover:text-[#12304A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Case Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedEntityId(entityId);
              navigateTo('network', { entityId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#12304A] text-xs font-semibold transition-colors border border-[#CBD5E1] shadow-sm"
          >
            <Network className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>Open in Network Graph</span>
          </button>

          <button
            onClick={() => {
              setSelectedEntityId(entityId);
              navigateTo('timeline', { entityId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#12304A] text-xs font-semibold transition-colors border border-[#CBD5E1] shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-[#087E8B]" />
            <span>View Timeline</span>
          </button>
        </div>
      </div>

      {/* 2. Main Entity Header Banner */}
      <div className="p-6 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center flex-shrink-0 shadow-sm">
              {getTypeIcon(dossier.type)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#12304A] font-mono tracking-tight">
                  {dossier.fullName}
                </h1>
                <span className="font-mono text-xs text-[#64748B]">({dossier.entityId})</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeBadge(dossier.type)}`}>
                  {dossier.type}
                </span>
                {dossier.isBridge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                    CENTRAL BRIDGE
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569] font-sans">
                <span>{dossier.occupation}</span>
                <span>•</span>
                <span>Case: <strong className="text-[#087E8B] font-mono">{dossier.primaryCaseId}</strong></span>
                <span>•</span>
                <span className="text-[#64748B]">Status: <strong className="text-[#16805C]">{dossier.caseStatus}</strong></span>
              </div>
            </div>
          </div>

          {/* Attention Score Gauge */}
          <div className="flex items-center gap-3 self-start md:self-auto p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-[#64748B] font-mono flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3 text-[#B7791F]" />
                <span>Attention Score</span>
              </div>
              <div className="text-xs text-[#64748B]">{dossier.priority} Priority</div>
            </div>
            <div className="px-3 py-1 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141] font-mono font-bold text-base shadow-sm">
              {dossier.attentionScore} / 100
            </div>
          </div>
        </div>

        {/* Quick In-Dossier Search */}
        <div className="relative pt-2 border-t border-[#E2E8F0]">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={profileSearch}
            onChange={(e) => setProfileSearch(e.target.value)}
            placeholder="Search within this entity dossier (e.g. phone, account, vehicle, location, evidence)..."
            className="w-full pl-9 pr-4 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B]"
          />
        </div>
      </div>

      {/* 3. Tabbed Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-[#E2E8F0]">
        {[
          { id: 'overview' as const, label: '1. Executive Summary' },
          { id: 'identity' as const, label: '2. Identity & Masked Docs' },
          { id: 'resolution' as const, label: '3. Identity Resolution & Provenance' },
          { id: 'financial' as const, label: `4. Financial Accounts (${dossier.associatedAccounts.length})` },
          { id: 'telecom' as const, label: `5. Telecom & Phones (${dossier.associatedPhones.length})` },
          { id: 'logistics' as const, label: `6. Vehicles & Locations (${dossier.associatedVehicles.length + dossier.associatedLocations.length})` },
          { id: 'relationships' as const, label: `7. Asset & Relationship Map (${dossier.relationships.length})` },
          { id: 'timeline_evidence' as const, label: `8. Timeline & Evidence (${dossier.evidenceRecords.length})` },
          { id: 'notes' as const, label: `9. Investigator Notes (${notes.length})` }
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

      {/* 4. Tab Content Panels */}

      {/* TAB 1: EXECUTIVE SUMMARY */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#087E8B] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>INTELLIGENCE EXECUTIVE SUMMARY</span>
            </span>
            <p className="text-xs text-[#334155] leading-relaxed font-sans">
              {dossier.executiveSummaryText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left: Attention Score Factor Breakdown */}
            <div className="md:col-span-6 p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B7791F]" />
                <span>Attention Score Factor Breakdown ({dossier.attentionScore}/100)</span>
              </span>

              <div className="space-y-2 text-xs">
                {dossier.attentionFactors.map((f, idx) => (
                  <div key={idx} className="p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-[#12304A]">{f.factor}</span>
                      <span className="font-mono text-[#16805C] font-bold">{f.points} pts</span>
                    </div>
                    <p className="text-[11px] text-[#64748B]">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Asset & Relationship Hierarchy Tree */}
            <div className="md:col-span-6 p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#087E8B]" />
                <span>Asset & Connected Entities Hierarchy Tree</span>
              </span>

              <div className="p-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs space-y-2.5">
                <div className="font-bold text-[#12304A] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#087E8B]" />
                  <span>{dossier.fullName} ({dossier.entityId})</span>
                </div>

                <div className="pl-4 border-l border-[#CBD5E1] space-y-2 text-[11px]">
                  {/* Phones */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">├── 📱 Phones:</span>
                    {dossier.associatedPhones.map(p => (
                      <span 
                        key={p.id}
                        onClick={() => handleNavigateEntity(p.id)}
                        className="text-[#16805C] bg-[#E8F7F0] px-1.5 py-0.5 rounded border border-[#A3E0C8] cursor-pointer hover:underline"
                      >
                        {p.id}
                      </span>
                    ))}
                  </div>

                  {/* Accounts */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">├── 💳 Accounts:</span>
                    {dossier.associatedAccounts.map(a => (
                      <span 
                        key={a.id}
                        onClick={() => handleNavigateEntity(a.id)}
                        className="text-[#2563A6] bg-[#EBF8FF] px-1.5 py-0.5 rounded border border-[#BEE3F8] cursor-pointer hover:underline"
                      >
                        {a.id}
                      </span>
                    ))}
                  </div>

                  {/* Vehicles */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">├── 🚗 Vehicles:</span>
                    {dossier.associatedVehicles.map(v => (
                      <span 
                        key={v.id}
                        onClick={() => handleNavigateEntity(v.id)}
                        className="text-[#B7791F] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FCD34D] cursor-pointer hover:underline"
                      >
                        {v.id}
                      </span>
                    ))}
                  </div>

                  {/* Locations */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">├── 📍 Locations:</span>
                    {dossier.associatedLocations.map(l => (
                      <span 
                        key={l.id}
                        onClick={() => handleNavigateEntity(l.id)}
                        className="text-[#7E22CE] bg-[#F3E8FF] px-1.5 py-0.5 rounded border border-[#E9D5FF] cursor-pointer hover:underline"
                      >
                        {l.id}
                      </span>
                    ))}
                  </div>

                  {/* Organizations */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#64748B]">├── 🏢 Corporate:</span>
                    {dossier.associatedOrganizations.map(o => (
                      <span 
                        key={o.id}
                        onClick={() => handleNavigateEntity(o.id)}
                        className="text-[#234E70] bg-[#E6F4F5] px-1.5 py-0.5 rounded border border-[#A7DFE3] cursor-pointer hover:underline"
                      >
                        {o.id}
                      </span>
                    ))}
                  </div>

                  {/* Counterparties */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#64748B]">└── 👥 Counterparties:</span>
                    {dossier.relationships.slice(0, 3).map(r => (
                      <span 
                        key={r.targetEntityId}
                        onClick={() => handleNavigateEntity(r.targetEntityId)}
                        className="text-[#087E8B] bg-[#E6F4F5] px-1.5 py-0.5 rounded border border-[#A7DFE3] cursor-pointer hover:underline"
                      >
                        {r.targetEntityId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IDENTITY & MASKED DOCS */}
      {activeTab === 'identity' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Identity Demographics */}
          <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
              Personal Demographics & Official Record
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block font-sans">Full Legal Name:</span>
                <strong className="text-[#12304A] text-sm">{dossier.fullName}</strong>
              </div>

              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block font-sans">Date of Birth & Age:</span>
                <strong className="text-[#17212B]">{dossier.dateOfBirth}</strong>
              </div>

              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block font-sans">Nationality:</span>
                <strong className="text-[#17212B]">{dossier.nationality}</strong>
              </div>

              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block font-sans">Gender:</span>
                <strong className="text-[#17212B]">{dossier.gender || 'Not specified'}</strong>
              </div>

              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block font-sans">Occupation / Trade:</span>
                <strong className="text-[#17212B]">{dossier.occupation}</strong>
              </div>

              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] text-[10px] block font-sans">Known Aliases:</span>
                <strong className="text-[#087E8B]">{dossier.aliases.join(', ')}</strong>
              </div>
            </div>
          </div>

          {/* Identity Documents with Masked Values & Reveal Toggle */}
          <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#12304A] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#B7791F]" />
                  <span>Restricted Identity Documents</span>
                </h3>
                <p className="text-xs text-[#64748B]">Masked by default in compliance with data protection & privacy protocols.</p>
              </div>

              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
              >
                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isRevealed ? 'Hide Identifiers' : 'Reveal with Authorization'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
              {dossier.identityDocuments.map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans font-semibold text-[#64748B]">{doc.docName}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">
                      {doc.issuingAuthority}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-[#12304A]">
                    {isRevealed ? doc.unmaskedNumber : doc.maskedNumber}
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">Verified via KYC Core</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RESOLUTION */}
      {activeTab === 'resolution' && (
        <IdentityResolutionTab entityId={entityId} caseId={activeCaseId} />
      )}

      {/* TAB 4: FINANCIAL */}
      {activeTab === 'financial' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Associated Bank & Financial Accounts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dossier.associatedAccounts.map(acc => (
              <div key={acc.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="font-bold text-[#12304A]">{acc.bankName} ({acc.accountNumber})</div>
                <div className="text-xs text-[#64748B] font-mono">Account ID: {acc.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TELECOM */}
      {activeTab === 'telecom' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Registered & Intercepted Phone Numbers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dossier.associatedPhones.map(p => (
              <div key={p.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="font-bold text-[#12304A]">{p.number} ({p.carrier})</div>
                <div className="text-xs text-[#64748B] font-mono">Phone ID: {p.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LOGISTICS */}
      {activeTab === 'logistics' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Vehicles & Surveillance Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dossier.associatedVehicles.map(v => (
              <div key={v.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="font-bold text-[#12304A]">Vehicle: {v.makeModel} ({v.registrationNumber})</div>
                <div className="text-xs text-[#64748B] font-mono">ID: {v.id}</div>
              </div>
            ))}
            {dossier.associatedLocations.map(l => (
              <div key={l.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="font-bold text-[#12304A]">Location: {l.name}</div>
                <div className="text-xs text-[#64748B] font-mono">ID: {l.id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: RELATIONSHIPS */}
      {activeTab === 'relationships' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Direct Links & Associations ({dossier.relationships.length})</h3>
          <div className="space-y-2">
            {dossier.relationships.map((r, idx) => (
              <div key={idx} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-[#12304A]">{r.targetEntityLabel || r.targetEntityId}</div>
                  <div className="text-[11px] text-[#64748B] font-mono">{r.relationshipType}</div>
                </div>
                <button
                  onClick={() => handleNavigateEntity(r.targetEntityId)}
                  className="text-xs font-semibold text-[#087E8B] hover:underline"
                >
                  View Dossier
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: TIMELINE & EVIDENCE */}
      {activeTab === 'timeline_evidence' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Evidence Registry Records ({dossier.evidenceRecords.length})</h3>
          <div className="space-y-2">
            {dossier.evidenceRecords.map(ev => (
              <div key={ev.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#087E8B]">{ev.id}</span>
                  <span className="text-[10px] text-[#64748B]">{ev.timestamp}</span>
                </div>
                <div className="font-semibold text-[#12304A] text-xs">{ev.title}</div>
                <p className="text-[11px] text-[#475569]">{ev.sourceType}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: NOTES */}
      {activeTab === 'notes' && (
        <div className="p-5 border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm rounded-lg space-y-4">
          <h3 className="text-sm font-bold text-[#12304A]">Investigator Notes for {dossier.fullName}</h3>
          
          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Record observation, hypothesis, or field intelligence..."
              className="w-full p-3 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingNote || !newNoteContent.trim()}
                className="px-4 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold disabled:opacity-50"
              >
                {isSavingNote ? 'Saving...' : 'Add Note'}
              </button>
            </div>
          </form>

          <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
            {notes.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#64748B]">No notes recorded for this entity yet.</div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                    <span className="font-semibold text-[#12304A]">{note.author}</span>
                    <span>{new Date(note.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-[#334155] leading-relaxed font-sans">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
