import React from 'react';
import { ShieldCheck, Info, Lock } from 'lucide-react';
import { AuditLogTable } from '../components/audit/AuditLogTable';

export const Audit: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in select-none">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400">
          <ShieldCheck className="w-4 h-4" />
          <span>STATUTORY INVESTIGATION COMPLIANCE</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>AUDIT LOG</span>
        </h1>
        <p className="text-xs text-slate-400">
          Track activity performed within the TraceNet investigation system.
        </p>
      </div>

      <div className="p-3.5 rounded-lg bg-blue-950/20 border border-blue-500/30 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-0.5 leading-relaxed">
          <div>
            <strong>MHA Electronic Evidence Ledger:</strong> All case reviews, witness statement inspections, evidence verification operations, and intelligence report compilations are append-recorded into an immutable compliance trail.
          </div>
          <div className="text-[11px] text-slate-400">
            Records are cryptographically bound to investigator badge numbers and terminal identifiers.
          </div>
        </div>
      </div>

      <AuditLogTable />
    </div>
  );
};
