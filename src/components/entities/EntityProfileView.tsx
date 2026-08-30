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
  FileText, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Plus, 
  KeyRound,
  FileSpreadsheet,
  Activity,
  Share2,
  Calendar
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
  const { activeCaseId, navigateTo, setSelectedEntityId, setActiveCaseTab } = useInvestigation();
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
      case 'PERSON': return <User className="w-4 h-4 text-blue-400" />;
      case 'PHONE': return <Phone className="w-4 h-4 text-emerald-400" />;
      case 'ACCOUNT': return <CreditCard className="w-4 h-4 text-amber-400" />;
      case 'LOCATION': return <MapPin className="w-4 h-4 text-purple-400" />;
      case 'ORGANIZATION': return <Building2 className="w-4 h-4 text-indigo-400" />;
      case 'VEHICLE': return <Truck className="w-4 h-4 text-rose-400" />;
      default: return <User className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeBadge = (type: EntityType) => {
    switch (type) {
      case 'PERSON': return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'PHONE': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ACCOUNT': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'LOCATION': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'ORGANIZATION': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'VEHICLE': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const q = profileSearch.toLowerCase().trim();

  return (
    <div className="space-y-5 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-800">
        <button
          onClick={() => {
            if (onClose) onClose();
            else navigateTo('case-details', { tab: 'entities' });
          }}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shadow-sm"
          >
            <Network className="w-3.5 h-3.5 text-blue-400" />
            <span>Open in Network Graph</span>
          </button>

          <button
            onClick={() => {
              setSelectedEntityId(entityId);
              navigateTo('timeline', { entityId });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 shadow-sm"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Timeline</span>
          </button>
        </div>
      </div>

      {/* 2. Main Entity Header Banner */}
      <div className="intel-card p-6 border border-slate-700/80 bg-[#090f1e] shadow-2xl rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center flex-shrink-0 shadow-inner">
              {getTypeIcon(dossier.type)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
                  {dossier.fullName}
                </h1>
                <span className="font-mono text-xs text-slate-400">({dossier.entityId})</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getTypeBadge(dossier.type)}`}>
                  {dossier.type}
                </span>
                {dossier.isBridge && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    CENTRAL BRIDGE
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-sans">
                <span>{dossier.occupation}</span>
                <span>•</span>
                <span>Case: <strong className="text-blue-400 font-mono">{dossier.primaryCaseId}</strong></span>
                <span>•</span>
                <span className="text-slate-400">Status: <strong className="text-emerald-400">{dossier.caseStatus}</strong></span>
              </div>
            </div>
          </div>

          {/* Attention Score Gauge */}
          <div className="flex items-center gap-3 self-start md:self-auto p-3 rounded-xl bg-[#060a14] border border-slate-800">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Attention Score</span>
              </div>
              <div className="text-xs text-slate-400">{dossier.priority} Priority</div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-base shadow-sm">
              {dossier.attentionScore} / 100
            </div>
          </div>
        </div>

        {/* Quick In-Dossier Search */}
        <div className="relative pt-2 border-t border-slate-800/80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={profileSearch}
            onChange={(e) => setProfileSearch(e.target.value)}
            placeholder="Search within this entity dossier (e.g. phone, account, vehicle, location, evidence)..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
          />
        </div>
      </div>

      {/* 3. Tabbed Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-800">
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
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
          {/* Executive Overview Narrative */}
          <div className="intel-card p-5 border border-slate-800 bg-[#090f1e] space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>INTELLIGENCE EXECUTIVE SUMMARY</span>
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {dossier.executiveSummaryText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Left: Attention Score Factor Breakdown */}
            <div className="md:col-span-6 intel-card p-5 border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Attention Score Factor Breakdown ({dossier.attentionScore}/100)</span>
              </span>

              <div className="space-y-2 text-xs">
                {dossier.attentionFactors.map((f, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#090e1a] border border-slate-800 space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">{f.factor}</span>
                      <span className="font-mono text-emerald-400 font-bold">{f.points} pts</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Asset & Relationship Hierarchy Tree */}
            <div className="md:col-span-6 intel-card p-5 border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Asset & Connected Entities Hierarchy Tree</span>
              </span>

              <div className="p-4 rounded-xl bg-[#060a14] border border-slate-800 font-mono text-xs space-y-2.5">
                <div className="font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>{dossier.fullName} ({dossier.entityId})</span>
                </div>

                <div className="pl-4 border-l border-slate-800 space-y-2 text-[11px]">
                  {/* Phones */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">├── 📱 Phones:</span>
                    {dossier.associatedPhones.map(p => (
                      <span 
                        key={p.id}
                        onClick={() => handleNavigateEntity(p.id)}
                        className="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30 cursor-pointer hover:underline"
                      >
                        {p.id}
                      </span>
                    ))}
                  </div>

                  {/* Accounts */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">├── 💳 Accounts:</span>
                    {dossier.associatedAccounts.map(a => (
                      <span 
                        key={a.id}
                        onClick={() => handleNavigateEntity(a.id)}
                        className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30 cursor-pointer hover:underline"
                      >
                        {a.id}
                      </span>
                    ))}
                  </div>

                  {/* Vehicles */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">├── 🚗 Vehicles:</span>
                    {dossier.associatedVehicles.map(v => (
                      <span 
                        key={v.id}
                        onClick={() => handleNavigateEntity(v.id)}
                        className="text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30 cursor-pointer hover:underline"
                      >
                        {v.id}
                      </span>
                    ))}
                  </div>

                  {/* Locations */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">├── 📍 Locations:</span>
                    {dossier.associatedLocations.map(l => (
                      <span 
                        key={l.id}
                        onClick={() => handleNavigateEntity(l.id)}
                        className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30 cursor-pointer hover:underline"
                      >
                        {l.id}
                      </span>
                    ))}
                  </div>

                  {/* Organizations */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">├── 🏢 Corporate:</span>
                    {dossier.associatedOrganizations.map(o => (
                      <span 
                        key={o.id}
                        onClick={() => handleNavigateEntity(o.id)}
                        className="text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30 cursor-pointer hover:underline"
                      >
                        {o.id}
                      </span>
                    ))}
                  </div>

                  {/* Counterparties */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-500">└── 👥 Counterparties:</span>
                    {dossier.relationships.slice(0, 3).map(r => (
                      <span 
                        key={r.targetEntityId}
                        onClick={() => handleNavigateEntity(r.targetEntityId)}
                        className="text-blue-300 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-500/30 cursor-pointer hover:underline"
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
          <div className="intel-card p-5 border border-slate-800 space-y-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Personal Demographics & Official Record
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-sans">Full Legal Name:</span>
                <strong className="text-white text-sm">{dossier.fullName}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-sans">Date of Birth & Age:</span>
                <strong className="text-slate-200">{dossier.dateOfBirth}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-sans">Nationality:</span>
                <strong className="text-slate-200">{dossier.nationality}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-sans">Gender:</span>
                <strong className="text-slate-200">{dossier.gender || 'Not specified'}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-sans">Occupation / Trade:</span>
                <strong className="text-slate-200">{dossier.occupation}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#090e1a] border border-slate-800">
                <span className="text-slate-500 text-[10px] block font-sans">Known Aliases:</span>
                <strong className="text-blue-300">{dossier.aliases.join(', ')}</strong>
              </div>
            </div>
          </div>

          {/* Identity Documents with Masked Values & Reveal Toggle */}
          <div className="intel-card p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Restricted Identity Documents</span>
                </h3>
                <p className="text-xs text-slate-400">Masked by default in compliance with data protection & privacy protocols.</p>
              </div>

              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm self-start sm:self-auto"
              >
                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isRevealed ? 'Hide Identifiers' : 'Reveal with Authorization'}</span>
              </button>
            </div>

            {isRevealed && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <KeyRound className="w-4 h-4 flex-shrink-0" />
                <span>Authorized investigator session ({user?.name || 'Inspector Rajesh Verma'}). Decryption logged in audit ledger.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              {dossier.identityDocuments.map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>{doc.docName}</span>
                    <span className="text-blue-400 font-mono">{doc.docType}</span>
                  </div>

                  <div className="text-sm font-bold text-white tracking-wider">
                    {isRevealed ? doc.unmaskedNumber : doc.maskedNumber}
                  </div>

                  <div className="text-[10px] text-slate-500 font-sans border-t border-slate-800/80 pt-1.5">
                    Authority: {doc.issuingAuthority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IDENTITY RESOLUTION & CROSS-RECORD PROVENANCE */}
      {activeTab === 'resolution' && (
        <IdentityResolutionTab 
          entityId={entityId} 
          caseId={activeCaseId} 
        />
      )}

      {/* TAB 4: FINANCIAL ACCOUNTS & TRANSACTIONS */}
      {activeTab === 'financial' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.associatedAccounts.map((acc) => (
              <div 
                key={acc.id}
                onClick={() => handleNavigateEntity(acc.id)}
                className="intel-card p-5 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all bg-[#090f1e] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="font-mono font-bold text-white text-sm">{acc.id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {acc.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Total Inbound:</span>
                    <strong className="text-emerald-400 text-sm">₹{acc.totalIncoming.toLocaleString()}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Total Outbound:</span>
                    <strong className="text-rose-400 text-sm">₹{acc.totalOutgoing.toLocaleString()}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans">
                  {acc.recentActivitySummary}
                </p>

                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>Bank: {acc.bankName} ({acc.ifscOrSwift})</span>
                  <span>{acc.totalTransactions} transactions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TELECOM & PHONES */}
      {activeTab === 'telecom' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dossier.associatedPhones.map((phone) => (
              <div 
                key={phone.id}
                onClick={() => handleNavigateEntity(phone.id)}
                className="intel-card p-5 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all bg-[#090f1e] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-white text-sm">{phone.id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {phone.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Calls</span>
                    <strong className="text-white text-sm">{phone.totalCalls}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Inbound</span>
                    <strong className="text-blue-400 text-sm">{phone.inboundCalls}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-sans">Outbound</span>
                    <strong className="text-emerald-400 text-sm">{phone.outboundCalls}</strong>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>Carrier: {phone.carrier}</span>
                  <span>Last: {phone.lastSeen}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VEHICLES & LOCATIONS */}
      {activeTab === 'logistics' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Vehicles */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Associated Vehicles ({dossier.associatedVehicles.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dossier.associatedVehicles.map((veh) => (
                <div 
                  key={veh.id}
                  onClick={() => handleNavigateEntity(veh.id)}
                  className="intel-card p-4 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all bg-[#090f1e] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-rose-400" />
                      <span className="font-mono font-bold text-white">{veh.id}</span>
                    </div>
                    <span className="text-xs font-mono text-rose-300 font-bold">{veh.registrationNumber}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">{veh.vehicleType} • {veh.makeModel}</p>
                  <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 flex justify-between">
                    <span>ANPR Hits: {veh.tollObservationsCount}</span>
                    <span>Source: {veh.sourceRecord}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Associated Locations & Coordinates ({dossier.associatedLocations.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dossier.associatedLocations.map((loc) => (
                <div 
                  key={loc.id}
                  onClick={() => handleNavigateEntity(loc.id)}
                  className="intel-card p-4 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all bg-[#090f1e] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="font-mono font-bold text-white">{loc.name} ({loc.id})</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30">
                      {loc.locationType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">{loc.coordinates} • {loc.jurisdiction}</p>
                  <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-1.5 flex justify-between">
                    <span>Observation Count: {loc.observationCount} hits</span>
                    <span>Source: {loc.sourceRecord}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RELATIONSHIPS & ASSET MAP */}
      {activeTab === 'relationships' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="intel-card border border-slate-800 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold font-mono">
                  <tr>
                    <th className="py-3 px-4">Counterparty Entity</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Relationship</th>
                    <th className="py-3 px-4 text-center">Frequency</th>
                    <th className="py-3 px-4">First Seen</th>
                    <th className="py-3 px-4">Last Seen</th>
                    <th className="py-3 px-4">Source Record</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {dossier.relationships.map((rel, idx) => (
                    <tr 
                      key={idx}
                      onClick={() => handleNavigateEntity(rel.targetEntityId)}
                      className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                        {rel.targetEntityId} ({rel.targetEntityLabel})
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTypeBadge(rel.targetEntityType)}`}>
                          {rel.targetEntityType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                        {rel.relationshipType}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-white">
                        {rel.interactionCount} events
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {rel.firstSeen}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {rel.lastSeen}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {rel.sourceRecord}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateEntity(rel.targetEntityId);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white font-semibold text-[11px] transition-colors"
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TIMELINE & EVIDENCE */}
      {activeTab === 'timeline_evidence' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Verified Evidence Records */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Verified Source Records & SHA-256 Hashes
              </span>
              <button
                onClick={() => navigateTo('evidence')}
                className="text-[11px] font-semibold text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open Digital Evidence Registry</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {dossier.evidenceRecords.map((ev) => (
                <div key={ev.id} className="p-3.5 rounded-xl bg-[#090f1e] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white font-mono flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                      <span>{ev.id}: {ev.title}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Hash: <span className="text-slate-400">{ev.integrityHash}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    {ev.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Chronological Activity Stream ({dossier.timelineEvents.length} Events)
            </span>
            <div className="space-y-2 text-xs">
              {dossier.timelineEvents.length === 0 ? (
                <div className="p-6 text-center text-slate-500 font-mono">
                  No chronological events recorded for this entity.
                </div>
              ) : (
                dossier.timelineEvents.map((evt) => (
                  <div key={evt.id} className="p-3 rounded-lg bg-[#090e1a] border border-slate-800 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white">{evt.summary}</div>
                      <div className="text-[11px] text-slate-400 font-sans">{evt.details}</div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                      {evt.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: INVESTIGATOR NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="intel-card p-4 border border-slate-800 space-y-3 bg-[#0d1527]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Add Intelligence Note for {dossier.fullName} ({entityId}):
            </span>
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Record forensic observation, subpoena request, or counterparty lead..."
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 h-24"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSavingNote}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isSavingNote ? 'Saving Note...' : 'Save Note'}</span>
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Previous Intelligence Notes ({notes.length}):
            </span>
            {notes.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-mono">
                No investigator notes recorded for this entity yet.
              </div>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-[#090f1e] border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <div className="font-bold text-white font-mono flex items-center gap-2">
                      <span>{n.author}</span>
                      <span className="text-[10px] text-blue-400">({n.author_badge})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(n.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">{n.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
