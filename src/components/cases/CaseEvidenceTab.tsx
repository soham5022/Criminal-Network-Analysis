import React, { useEffect, useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  ArrowRight, 
  ExternalLink,
  Phone,
  CreditCard,
  Car,
  FileText
} from 'lucide-react';
import { caseService, EvidenceRecord } from '../../services/caseService';
import { useInvestigation } from '../../context/InvestigationContext';

export const CaseEvidenceTab: React.FC<{ caseId: string }> = ({ caseId }) => {
  const { navigateTo, setSelectedEntityId } = useInvestigation();
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    caseService.getEvidence(caseId)
      .then(setEvidence)
      .catch(err => console.warn('Evidence fetch fallback:', err))
      .finally(() => setIsLoading(false));
  }, [caseId]);

  const filtered = evidence.filter(e => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.record_id.toLowerCase().includes(q) ||
      e.primary_entity.toLowerCase().includes(q) ||
      e.counterparty_entity.toLowerCase().includes(q) ||
      e.record_type.toLowerCase().includes(q) ||
      e.sha256_hash.toLowerCase().includes(q)
    );
  });

  const handleInspectEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    navigateTo('investigate', { entityId });
  };

  const getChannelIcon = (type: string) => {
    if (type.includes('CDR') || type.includes('CALL')) return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
    if (type.includes('BANK') || type.includes('FINANCIAL')) return <CreditCard className="w-3.5 h-3.5 text-blue-400" />;
    if (type.includes('VEHICLE') || type.includes('ANPR')) return <Car className="w-3.5 h-3.5 text-amber-400" />;
    return <FileText className="w-3.5 h-3.5 text-purple-400" />;
  };

  return (
    <div className="space-y-4 select-none animate-in fade-in">
      {/* Search and Records Summary */}
      <div className="intel-card p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Source Evidence & Intercept Ledger ({filtered.length} Records)
          </h3>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records, entities, hashes..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#090e1a] border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Evidence Records Table */}
      <div className="intel-card border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Loading verified evidence records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No source records match your search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Record ID</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Involved Entities</th>
                  <th className="p-3.5">Intercept Timestamp</th>
                  <th className="p-3.5">Cryptographic Hash</th>
                  <th className="p-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((item) => (
                  <tr key={item.record_id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-400">
                      {item.record_id}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090e1a] border border-slate-800 text-xs text-slate-300">
                        {getChannelIcon(item.record_type)}
                        <span>{item.record_type}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-white">
                      <button 
                        onClick={() => handleInspectEntity(item.primary_entity)}
                        className="hover:text-blue-400 font-medium underline decoration-blue-500/40"
                      >
                        {item.primary_entity}
                      </button>
                      <span className="text-slate-500 mx-2">─▶</span>
                      <button 
                        onClick={() => handleInspectEntity(item.counterparty_entity)}
                        className="hover:text-blue-400 font-medium underline decoration-blue-500/40"
                      >
                        {item.counterparty_entity}
                      </button>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                      {item.sha256_hash.substring(0, 16)}...
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleInspectEntity(item.primary_entity)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                        title="Inspect in Network"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
