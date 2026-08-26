import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { AuditLogTable } from '../components/audit/AuditLogTable';

export const Audit: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in select-none">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Security Audit & Compliance Trail</span>
        </h2>
        <p className="text-xs text-slate-400">
          Cryptographically verified read-only log recording all user access, case modifications, and graph executions.
        </p>
      </div>

      <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/30 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300">
          <strong>LEA Compliance Notice:</strong> In accordance with Ministry of Home Affairs digital evidence protocols, all analytical queries, graph builds, and alert status modifications are timestamped with investigator badge numbers.
        </p>
      </div>

      <AuditLogTable />
    </div>
  );
};
