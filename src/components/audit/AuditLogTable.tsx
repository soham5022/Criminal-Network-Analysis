import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
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
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">
      {/* Filter and Control Bar */}
      <form onSubmit={handleSearchSubmit} className="intel-card p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#0d1527]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white">
            Security Audit Trail ({logs.length} Logged Events)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            placeholder="Filter by officer email..."
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-44"
          />

          <input
            type="text"
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            placeholder="Case ID (e.g. CASE-1024)..."
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 w-40"
          />

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Action Types</option>
            <option value="LOGIN">LOGIN</option>
            <option value="CASE_CREATED">CASE_CREATED</option>
            <option value="CASE_VIEWED">CASE_VIEWED</option>
            <option value="DATA_UPLOADED">DATA_UPLOADED</option>
            <option value="ANALYSIS_COMPLETED">ANALYSIS_COMPLETED</option>
            <option value="ALERT_STATUS_CHANGED">ALERT_STATUS_CHANGED</option>
            <option value="NOTE_CREATED">NOTE_CREATED</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </form>

      {/* Audit Log Table */}
      <div className="intel-card rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Loading compliance audit records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit log entries found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090e1a] text-[10px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Officer & Badge</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Case File</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-white font-semibold">{log.user_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.user_email}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                      {log.case_id || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
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
