import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Activity, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { auditService, AuditLogEntry } from '../../services/auditService';

export const AuditLogTable: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [userFilter, setUserFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [caseFilter, setCaseFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAuditLogs = async () => {
    setIsLoading(true);
    try {
      const data = await auditService.getAuditLogs({
        userEmail: userFilter || undefined,
        action: actionFilter !== 'ALL' ? actionFilter : undefined,
        caseId: caseFilter || undefined,
        limit: 150
      });
      setLogs(data);
    } catch (err) {
      console.warn('Audit logs fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [actionFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAuditLogs();
  };

  return (
    <div className="space-y-4 select-none">
      {/* Filter and Control Bar */}
      <form onSubmit={handleSearchSubmit} className="intel-card p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Immutable Security Audit Trail ({logs.length} Logged Actions)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <input
            type="text"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            placeholder="Filter by user email..."
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
          />

          <input
            type="text"
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            placeholder="Case ID (e.g. CASE-1024)..."
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-40"
          />

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Action Types</option>
            <option value="LOGIN">LOGIN</option>
            <option value="CASE_CREATED">CASE_CREATED</option>
            <option value="CASE_VIEWED">CASE_VIEWED</option>
            <option value="DATA_UPLOADED">DATA_UPLOADED</option>
            <option value="ANALYSIS_COMPLETED">ANALYSIS_COMPLETED</option>
            <option value="ALERT_STATUS_CHANGED">ALERT_STATUS_CHANGED</option>
            <option value="NOTE_CREATED">NOTE_CREATED</option>
            <option value="DEMO_RESET">DEMO_RESET</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Audit Log Table */}
      <div className="intel-card rounded-xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            Querying immutable audit records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            No audit log entries found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Log ID & Timestamp</th>
                  <th className="p-3.5">User & Role</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Case / Entity</th>
                  <th className="p-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-cyan-300">{log.id}</div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="text-white font-bold">{log.user_name}</div>
                      <div className="text-[10px] text-slate-400">{log.user_email} • <span className="text-indigo-400 font-bold">{log.user_role}</span></div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'LOGIN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        log.action === 'DEMO_RESET' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        log.action === 'CASE_CREATED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                        'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {log.case_id && <span className="font-bold text-cyan-400">{log.case_id}</span>}
                      {log.entity_id && <span className="text-slate-400 ml-1.5">({log.entity_id})</span>}
                      {!log.case_id && !log.entity_id && <span className="text-slate-600">—</span>}
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-xs font-sans text-xs">
                      {log.details}
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
