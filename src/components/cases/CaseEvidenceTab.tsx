import React, { useEffect, useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Hash, 
  Clock, 
  ExternalLink,
  Layers
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
    navigateTo('network', { entityId });
  };

  return (
    <div className="space-y-4 select-none">
      {/* Header & Filter */}
      <div className="intel-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Data Provenance & Source Evidence Ledger ({filtered.length} Indexed Records)
          </h3>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records, entities, hashes..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Evidence Table */}
      <div className="intel-card rounded-xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            Verifying data provenance and cryptographic record hashes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            No source evidence records match your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Source Record ID</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Entities Intercepted</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Cryptographic Hash</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item) => (
                  <tr key={item.record_id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3.5 font-bold text-cyan-300">
                      {item.record_id}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                        {item.record_type}
                      </span>
                    </td>
                    <td className="p-3.5 text-white">
                      <button 
                        onClick={() => handleInspectEntity(item.primary_entity)}
                        className="hover:text-cyan-400 underline decoration-cyan-500/40"
                      >
                        {item.primary_entity}
                      </button>
                      <span className="text-slate-500 mx-1.5">─▶</span>
                      <button 
                        onClick={() => handleInspectEntity(item.counterparty_entity)}
                        className="hover:text-cyan-400 underline decoration-cyan-500/40"
                      >
                        {item.counterparty_entity}
                      </button>
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(item.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 text-slate-500 text-[10px]">
                      {item.sha256_hash}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleInspectEntity(item.primary_entity)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
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
