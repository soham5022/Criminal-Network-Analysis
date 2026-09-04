import React, { useState, useEffect } from 'react';
import {
  Building2, FileText, Shield, AlertTriangle, Users, Network,
  Database, Clock, ArrowRight, Printer, Download, Loader2,
  CheckCircle2, XCircle, TrendingUp, Globe, Eye, BarChart3,
  BookOpen, Fingerprint, AlertOctagon, Link2, Info
} from 'lucide-react';
import {
  stationReportService,
  StationIntelligenceReport
} from '../../services/stationReportService';

function SeverityBadge({ severity }: { severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }) {
  const cls: Record<string, string> = {
    CRITICAL: 'bg-[#FEE2E2] text-[#C24141] border-[#FCA5A5]',
    HIGH: 'bg-[#FFEDD5] text-[#C24141] border-[#FDBA74]',
    MEDIUM: 'bg-[#FEF3C7] text-[#B7791F] border-[#FCD34D]',
    LOW: 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
  };
  return (
    <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border ${cls[severity]}`}>
      {severity}
    </span>
  );
}

function StatBox({
  value, label, color = 'text-[#12304A]', sub
}: { value: string | number; label: string; color?: string; sub?: string }) {
  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-3 text-center">
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
      <div className="text-[10px] font-bold uppercase text-[#64748B] mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-[#94A3B8] mt-0.5">{sub}</div>}
    </div>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 mb-4">
      <Icon className="w-4 h-4 text-[#087E8B]" />
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">{title}</h3>
    </div>
  );
}

// ── Print helper ──────────────────────────────────────────────
function buildPrintHtml(report: StationIntelligenceReport): string {
  const findingRows = report.analyticalFindings.map(f => `
    <div style="margin-bottom:10pt;padding:8pt;border:1pt solid #CBD5E1;background:#F8FAFC;page-break-inside:avoid">
      <div style="display:flex;justify-content:space-between;margin-bottom:4pt">
        <strong style="color:#12304A;font-size:10pt">${f.title}</strong>
        <span style="font-size:8pt;font-family:monospace;padding:1pt 5pt;border:1pt solid #FCA5A5;background:#FEE2E2;color:#C24141;font-weight:700">${f.severity}</span>
      </div>
      <p style="font-size:9.5pt;color:#334155;margin:4pt 0">${f.description}</p>
      <p style="font-size:8.5pt;color:#475569;margin:3pt 0"><strong>Detection Reason:</strong> ${f.detectionReason}</p>
      <p style="font-size:8.5pt;color:#087E8B;margin:3pt 0"><strong>Recommended Action:</strong> ${f.recommendedAction}</p>
    </div>
  `).join('');

  const crossCaseRows = report.crossCaseEntities.map(e => `
    <tr>
      <td style="padding:4pt 6pt;border:1pt solid #E2E8F0;font-family:monospace;font-size:8.5pt;color:#087E8B">${e.entityId}</td>
      <td style="padding:4pt 6pt;border:1pt solid #E2E8F0;font-size:9pt;font-weight:600">${e.entityLabel}</td>
      <td style="padding:4pt 6pt;border:1pt solid #E2E8F0;font-size:8.5pt">${e.entityType}</td>
      <td style="padding:4pt 6pt;border:1pt solid #E2E8F0;font-size:8.5pt;font-family:monospace">${e.caseIds.join(', ')}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8"/>
<title>TRACENET — Station Intelligence Report: ${report.reportId}</title>
<style>
@page { margin: 18mm 16mm; size: A4; }
* { box-sizing: border-box; color-adjust: exact; -webkit-print-color-adjust: exact; }
body { margin:0; padding:0; background:white; color:#17212B; font-family: 'Times New Roman', Georgia, serif; font-size:10pt; line-height:1.6; }
.page-break { page-break-before: always; }
table { border-collapse: collapse; width: 100%; }
th { background:#12304A; color:white; padding:5pt 8pt; font-size:8.5pt; text-align:left; font-family:Arial,sans-serif; letter-spacing:0.05em; }
td { padding:4pt 6pt; border:1pt solid #E2E8F0; font-size:9pt; }
.stat-grid { display:grid; grid-template-columns: repeat(4,1fr); gap:6pt; margin:8pt 0; }
.stat-box { background:#F8FAFC; border:1pt solid #CBD5E1; padding:6pt; text-align:center; }
.stat-val { font-size:18pt; font-weight:700; font-family:monospace; color:#12304A; }
.stat-lbl { font-size:7pt; text-transform:uppercase; font-weight:700; color:#64748B; font-family:Arial,sans-serif; letter-spacing:0.08em; }
.section { margin-top:16pt; }
.section-head { font-size:9pt; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#12304A; border-bottom:1.5pt solid #CBD5E1; padding-bottom:3pt; margin-bottom:8pt; font-family:Arial,sans-serif; }
.meta-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6pt; background:#F8FAFC; border:1pt solid #CBD5E1; padding:8pt; margin:10pt 0; }
.meta-cell .lbl { font-size:7pt; font-weight:700; text-transform:uppercase; color:#64748B; font-family:Arial,sans-serif; display:block; margin-bottom:2pt; }
.meta-cell .val { font-size:9.5pt; font-weight:600; color:#12304A; }
.disclaimer { margin-top:20pt; padding:8pt; border:1pt solid #CBD5E1; background:#F8FAFC; font-size:8pt; color:#475569; font-style:italic; }
.footer { margin-top:14pt; border-top:1pt solid #CBD5E1; padding-top:6pt; display:flex; justify-content:space-between; font-size:7.5pt; font-family:monospace; color:#64748B; }
.watermark { position:fixed; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-40deg); font-size:60pt; font-weight:900; color:rgba(8,126,139,0.04); white-space:nowrap; pointer-events:none; z-index:0; }
</style>
</head><body>
<div class="watermark">CONFIDENTIAL</div>

<!-- Header -->
<div style="border-bottom:2.5pt solid #12304A;padding-bottom:10pt;margin-bottom:14pt;text-align:center">
  <span style="font-size:8pt;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#087E8B;display:block;margin-bottom:4pt;font-family:Arial,sans-serif">CONFIDENTIAL // LAW ENFORCEMENT STATION INTELLIGENCE BRIEFING</span>
  <div style="font-size:16pt;font-weight:700;color:#12304A;margin:4pt 0">STATION INTELLIGENCE REPORT</div>
  <div style="font-size:10pt;color:#334155;margin:2pt 0">${report.stationName}</div>
  <div style="font-family:monospace;font-size:8.5pt;color:#64748B;margin-top:4pt">
    REPORT ID: ${report.reportId} &nbsp;•&nbsp; REPORTING PERIOD: ${report.reportingPeriod}
  </div>
</div>

<!-- Meta -->
<div class="meta-grid">
  <div class="meta-cell"><span class="lbl">Jurisdiction</span><span class="val">${report.jurisdiction}</span></div>
  <div class="meta-cell"><span class="lbl">Generated By</span><span class="val">${report.generatedBy}</span></div>
  <div class="meta-cell"><span class="lbl">Generated Date</span><span class="val" style="font-family:monospace">${report.generatedDate}</span></div>
  <div class="meta-cell"><span class="lbl">Generated Time</span><span class="val" style="font-family:monospace">${report.generatedTime}</span></div>
</div>

<!-- 2. Case Portfolio -->
<div class="section">
  <div class="section-head">1. Case Portfolio</div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-val">${report.casePortfolio.totalCases}</div><div class="stat-lbl">Total Cases</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#16805C">${report.casePortfolio.activeCases}</div><div class="stat-lbl">Active</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#C24141">${report.casePortfolio.critical}</div><div class="stat-lbl">Critical Priority</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#087E8B">${report.casePortfolio.high}</div><div class="stat-lbl">High Priority</div></div>
  </div>
</div>

<!-- 3. Evidence Summary -->
<div class="section">
  <div class="section-head">2. Evidence Summary</div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-val">${report.evidenceSummary.totalItems}</div><div class="stat-lbl">Total Items</div></div>
    <div class="stat-box"><div class="stat-val">${report.evidenceSummary.sha256Verified}</div><div class="stat-lbl">SHA-256 Verified</div></div>
    <div class="stat-box"><div class="stat-val">${report.evidenceSummary.images + report.evidenceSummary.videos}</div><div class="stat-lbl">Visual Evidence</div></div>
    <div class="stat-box"><div class="stat-val">${report.evidenceSummary.documents}</div><div class="stat-lbl">Documents</div></div>
  </div>
</div>

<!-- 4. Entity Summary -->
<div class="section">
  <div class="section-head">3. Entity Intelligence Summary</div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-val">${report.entitySummary.totalEntities}</div><div class="stat-lbl">Total Entities</div></div>
    <div class="stat-box"><div class="stat-val">${report.entitySummary.persons}</div><div class="stat-lbl">Persons</div></div>
    <div class="stat-box"><div class="stat-val">${report.entitySummary.phones + report.entitySummary.accounts}</div><div class="stat-lbl">Comm / Accounts</div></div>
    <div class="stat-box"><div class="stat-val">${report.entitySummary.vehicles}</div><div class="stat-lbl">Vehicles</div></div>
  </div>
</div>

<!-- 5. Alerts -->
<div class="section">
  <div class="section-head">4. Alert Summary</div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-val" style="color:#C24141">${report.alertSummary.critical}</div><div class="stat-lbl">Critical Alerts</div></div>
    <div class="stat-box"><div class="stat-val" style="color:#B7791F">${report.alertSummary.high}</div><div class="stat-lbl">High Alerts</div></div>
    <div class="stat-box"><div class="stat-val">${report.alertSummary.open}</div><div class="stat-lbl">Open / New</div></div>
    <div class="stat-box"><div class="stat-val">${report.alertSummary.total}</div><div class="stat-lbl">Total Alerts</div></div>
  </div>
</div>

<!-- 6. Network -->
<div class="section">
  <div class="section-head">5. Network Intelligence</div>
  <div class="stat-grid">
    <div class="stat-box"><div class="stat-val">${report.networkSummary.totalRelationships}</div><div class="stat-lbl">Relationships</div></div>
    <div class="stat-box"><div class="stat-val">${report.networkSummary.communities}</div><div class="stat-lbl">Communities</div></div>
    <div class="stat-box"><div class="stat-val">${report.networkSummary.bridgeEntities}</div><div class="stat-lbl">Bridge Entities</div></div>
    <div class="stat-box"><div class="stat-val">${report.networkSummary.crossCaseConnections}</div><div class="stat-lbl">Cross-Case Links</div></div>
  </div>
</div>

<div class="page-break"></div>

<!-- 7. Cross-Case Entities -->
<div class="section">
  <div class="section-head">6. Cross-Case Entity Associations</div>
  <table>
    <thead><tr><th>Entity ID</th><th>Label</th><th>Type</th><th>Associated Cases</th></tr></thead>
    <tbody>${crossCaseRows || '<tr><td colspan="4" style="text-align:center;color:#64748B;font-style:italic">No cross-case entities identified</td></tr>'}</tbody>
  </table>
</div>

<!-- 8. Analytical Findings -->
<div class="section">
  <div class="section-head">7. Analytical Findings (Require Investigator Verification)</div>
  <p style="font-size:8.5pt;font-style:italic;color:#64748B;margin-bottom:8pt">AI-generated analytical findings require investigator verification. These are investigative leads, not determinations of guilt.</p>
  ${findingRows}
</div>

<!-- Disclaimer -->
<div class="disclaimer">
  <strong>STATUTORY NOTICE:</strong> ${report.disclaimer}
</div>

<!-- Footer -->
<div class="footer">
  <span>TraceNet Intelligence Platform — ${report.reportId}</span>
  <span>${report.stationName}</span>
  <span>CONFIDENTIAL — AUTHORIZED LAW ENFORCEMENT ONLY</span>
</div>

<script>window.onload = function(){ window.print(); }</script>
</body></html>`;
}

// ── Main Component ────────────────────────────────────────────
export const StationIntelligenceReportView: React.FC = () => {
  const [report, setReport] = useState<StationIntelligenceReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState('');
  const [generated, setGenerated] = useState(false);

  const steps = [
    'Aggregating case portfolio data...',
    'Compiling evidence registry statistics...',
    'Calculating entity intelligence summary...',
    'Analysing cross-case entity associations...',
    'Detecting analytical patterns...',
    'Generating investigative priorities...',
    'Computing data quality metrics...',
    'Finalizing station intelligence briefing...'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerated(false);
    for (const s of steps) {
      setStep(s);
      await new Promise(r => setTimeout(r, 260));
    }
    const r = await stationReportService.generateStationReport();
    setReport(r);
    setIsGenerating(false);
    setGenerated(true);
  };

  const handlePrint = () => {
    if (!report) return;
    const pw = window.open('', '_blank', 'width=900,height=1200');
    if (!pw) { alert('Pop-up blocked — please allow pop-ups and try again.'); return; }
    pw.document.open();
    pw.document.write(buildPrintHtml(report));
    pw.document.close();
  };

  // ── Pre-generate state ──────────────────────────────────────
  if (!generated && !isGenerating) {
    return (
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#E6F4F5] flex items-center justify-center">
          <Building2 className="w-7 h-7 text-[#087E8B]" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#12304A]">Station Intelligence Report</h2>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1.5">
            Dynamically aggregates ALL authorized cases, evidence, entities, alerts, cross-case associations, and analytical findings into a comprehensive station-level intelligence briefing.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center py-2">
          {[
            { icon: FileText, label: 'Case Portfolio' },
            { icon: Database, label: 'Evidence Registry' },
            { icon: Users, label: 'Entity Intelligence' },
            { icon: Network, label: 'Cross-Case Network' }
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0]">
              <Icon className="w-4 h-4 text-[#087E8B] mx-auto mb-1" />
              <span className="text-[#475569] font-medium">{label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleGenerate}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-colors shadow-sm"
        >
          <BarChart3 className="w-4 h-4" />
          Generate Station Intelligence Report
        </button>
        <p className="text-[10px] text-[#94A3B8]">
          SYNTHETIC DEMO ENVIRONMENT — Data is dynamically read from the current application state
        </p>
      </div>
    );
  }

  // ── Generating state ────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="bg-[#FFFFFF] rounded-lg border border-[#E2E8F0] p-12 text-center space-y-4 shadow-sm">
        <Loader2 className="w-10 h-10 text-[#087E8B] animate-spin mx-auto" />
        <div className="font-bold text-[#12304A] text-sm">{step}</div>
        <div className="text-xs text-[#64748B]">Compiling multi-case station intelligence briefing...</div>
        <div className="w-48 mx-auto h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div className="h-1 bg-[#087E8B] rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (!report) return null;

  // ── Generated report view ───────────────────────────────────
  return (
    <div className="space-y-4 select-none animate-in fade-in">

      {/* Action bar */}
      <div className="bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#087E8B]">{report.reportId}</span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">STATION INTELLIGENCE BRIEFING</span>
          </div>
          <h2 className="text-base font-bold text-[#12304A]">Station Intelligence Report</h2>
          <p className="text-[11px] text-[#64748B]">{report.stationName} • Generated {report.generatedDate} {report.generatedTime}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] text-xs font-semibold transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Regenerate
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Official Report
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#CBD5E1] rounded-lg shadow-sm space-y-8 text-[#17212B]">

        {/* Report header */}
        <div className="border-b-2 border-[#12304A] pb-4 space-y-1.5 text-center">
          <div className="text-[10px] font-bold tracking-widest text-[#087E8B] uppercase">
            CONFIDENTIAL // LAW ENFORCEMENT STATION INTELLIGENCE BRIEFING
          </div>
          <h1 className="text-xl font-bold text-[#12304A]">STATION INTELLIGENCE REPORT</h1>
          <div className="text-sm text-[#334155]">{report.stationName}</div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#64748B] font-mono pt-1">
            <span>ID: {report.reportId}</span>
            <span>•</span>
            <span>PERIOD: {report.reportingPeriod}</span>
            <span>•</span>
            <span>{report.generatedDate} {report.generatedTime}</span>
          </div>
        </div>

        {/* Report metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
          {[
            { label: 'Jurisdiction', value: report.jurisdiction },
            { label: 'Reporting Officer', value: report.generatedBy },
            { label: 'Badge Number', value: report.badgeNumber },
            { label: 'Reporting Period', value: report.reportingPeriod }
          ].map(({ label, value }) => (
            <div key={label}>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">{label}</span>
              <span className="font-semibold text-[#12304A]">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Section 1: Case Portfolio ────────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={FileText} title="1. Case Portfolio" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.casePortfolio.totalCases} label="Total Cases" color="text-[#12304A]" />
            <StatBox value={report.casePortfolio.activeCases} label="Active" color="text-[#16805C]" />
            <StatBox value={report.casePortfolio.underReview} label="Under Review" color="text-[#B7791F]" />
            <StatBox value={report.casePortfolio.closed} label="Closed / Archived" color="text-[#64748B]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.casePortfolio.critical} label="Critical Priority" color="text-[#C24141]" />
            <StatBox value={report.casePortfolio.high} label="High Priority" color="text-[#087E8B]" />
            <StatBox value={report.casePortfolio.medium} label="Medium Priority" color="text-[#B7791F]" />
            <StatBox value={report.casePortfolio.routine} label="Routine" color="text-[#64748B]" />
          </div>
        </div>

        {/* ── Section 2: Recent Case Activity ─────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={Clock} title="2. Recent Case Activity" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-[#64748B] mb-2">Recently Registered Cases</p>
              <div className="space-y-1.5">
                {report.recentCaseActivity.newCases.map(c => (
                  <div key={c.id} className="flex items-center justify-between text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2.5 py-1.5">
                    <span className="font-mono font-bold text-[#087E8B]">{c.id}</span>
                    <span className="text-[#12304A] font-semibold truncate mx-2">{c.name}</span>
                    <SeverityBadge severity={c.priority as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'} />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <StatBox value={report.recentCaseActivity.recentRecords} label="Total Records" />
              <StatBox value={report.recentCaseActivity.recentEvidenceUploads} label="Evidence Items" />
            </div>
          </div>
        </div>

        {/* ── Section 3: Record Summary ────────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={BookOpen} title="3. Record Summary" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.recordSummary.totalRecords} label="Total Records" />
            <StatBox value={report.recordSummary.firs} label="FIRs Filed" />
            <StatBox value={report.recordSummary.statements} label="Statements" />
            <StatBox value={report.recordSummary.intelligenceReports} label="Intel Reports" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.recordSummary.criminalHistoryRecords} label="Criminal History" />
            <StatBox value={report.recordSummary.socialIntelRecords} label="Social Intel" />
            <StatBox value={report.recordSummary.forensicReports} label="Forensic Reports" />
            <StatBox value={report.recordSummary.caseDiaries} label="Case Diaries" />
          </div>
        </div>

        {/* ── Section 4: Evidence Summary ──────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={Shield} title="4. Evidence Registry Summary" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.evidenceSummary.totalItems} label="Total Items" color="text-[#12304A]" />
            <StatBox value={report.evidenceSummary.sha256Verified} label="SHA-256 Verified" color="text-[#16805C]" />
            <StatBox value={report.evidenceSummary.pendingVerification} label="Pending Verification" color="text-[#B7791F]" />
            <StatBox value={report.evidenceSummary.images + report.evidenceSummary.videos} label="Visual Evidence" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-xs">
            {[
              { label: 'Images', val: report.evidenceSummary.images },
              { label: 'CCTV/Video', val: report.evidenceSummary.videos },
              { label: 'Audio', val: report.evidenceSummary.audio },
              { label: 'Documents', val: report.evidenceSummary.documents },
              { label: 'Datasets', val: report.evidenceSummary.structuredDatasets },
              { label: 'Other', val: report.evidenceSummary.otherFiles }
            ].map(({ label, val }) => (
              <div key={label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2 text-center">
                <div className="font-mono font-bold text-[#12304A] text-sm">{val}</div>
                <div className="text-[10px] text-[#64748B] uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 5: Entity Summary ─────────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={Users} title="5. Entity Intelligence Summary" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.entitySummary.totalEntities} label="Total Entities" color="text-[#12304A]" />
            <StatBox value={report.entitySummary.persons} label="Persons" />
            <StatBox value={report.entitySummary.phones} label="Phone / Comms" />
            <StatBox value={report.entitySummary.accounts} label="Financial Accounts" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.entitySummary.vehicles} label="Vehicles" />
            <StatBox value={report.entitySummary.locations} label="Locations" />
            <StatBox value={report.entitySummary.organizations} label="Organizations" />
            <StatBox value={report.entitySummary.events} label="Events (NEW)" color="text-[#087E8B]" />
          </div>
        </div>

        {/* ── Section 6: Network Intelligence ────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={Network} title="6. Network Intelligence" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <StatBox value={report.networkSummary.totalRelationships} label="Relationships" />
            <StatBox value={report.networkSummary.communities} label="Communities" />
            <StatBox value={report.networkSummary.bridgeEntities} label="Bridge Entities" color="text-[#C24141]" />
            <StatBox value={report.networkSummary.highCentralityEntities} label="High Centrality" />
            <StatBox value={report.networkSummary.crossCaseConnections} label="Cross-Case Links" color="text-[#087E8B]" />
          </div>
        </div>

        {/* ── Section 7: Alert Summary ─────────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={AlertTriangle} title="7. Alert Summary" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.alertSummary.critical} label="Critical" color="text-[#C24141]" />
            <StatBox value={report.alertSummary.high} label="High" color="text-[#087E8B]" />
            <StatBox value={report.alertSummary.open} label="Open / New" color="text-[#B7791F]" />
            <StatBox value={report.alertSummary.total} label="Total Alerts" />
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <StatBox value={report.alertSummary.investigating} label="Under Investigation" />
            <StatBox value={report.alertSummary.medium} label="Medium" />
            <StatBox value={report.alertSummary.resolved} label="Resolved / Dismissed" color="text-[#16805C]" />
          </div>
        </div>

        {/* ── Section 8: Cross-Case Intelligence ───────────── */}
        <div className="space-y-3">
          <SectionHeading icon={Link2} title="8. Cross-Case Entity Intelligence" />
          {report.crossCaseEntities.length === 0 ? (
            <p className="text-xs text-[#64748B] italic">No cross-case entity associations identified.</p>
          ) : (
            <div className="space-y-1.5">
              {report.crossCaseEntities.map(e => (
                <div key={e.entityId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#087E8B]">{e.entityId}</span>
                    <span className="font-semibold text-[#12304A]">{e.entityLabel}</span>
                    <span className="px-1.5 py-0.5 text-[9px] rounded bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3] font-mono font-bold">{e.entityType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[#64748B]">Cases:</span>
                    {e.caseIds.map(cid => (
                      <span key={cid} className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FFFFFF] border border-[#CBD5E1] text-[#12304A]">{cid}</span>
                    ))}
                    {e.alertCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141]">{e.alertCount} Alerts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 9: Identity Findings ─────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={Fingerprint} title="9. Identity Resolution Findings" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatBox value={report.identityFindings.potentialMatches} label="Potential Matches" color="text-[#B7791F]" />
            <StatBox value={report.identityFindings.confirmedMatches} label="Confirmed Matches" color="text-[#16805C]" />
            <StatBox value={report.identityFindings.dataConflicts} label="Data Conflicts" color="text-[#C24141]" />
            <StatBox value={report.identityFindings.pendingReview} label="Pending Review" color="text-[#087E8B]" />
          </div>
        </div>

        {/* ── Section 10: Analytical Findings ──────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={TrendingUp} title="10. Analytical Findings" />
          <div className="p-3 rounded-md bg-[#FEF3C7] border border-[#FCD34D] text-[11px] text-[#92400E] flex items-start gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>AI-generated analytical findings require investigator verification and must not be treated as automated determinations of guilt or innocence.</span>
          </div>
          <div className="space-y-3">
            {report.analyticalFindings.map((f, i) => (
              <div key={i} className="p-4 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-[#12304A]">{f.title}</span>
                  <SeverityBadge severity={f.severity} />
                </div>
                <p className="text-xs text-[#334155] leading-relaxed">{f.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded p-2">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Detection Reason</span>
                    <span className="text-[#334155]">{f.detectionReason}</span>
                  </div>
                  <div className="bg-[#E8F7F0] border border-[#A3E0C8] rounded p-2">
                    <span className="text-[10px] text-[#16805C] uppercase font-bold block mb-1">Recommended Action</span>
                    <span className="text-[#16805C]">{f.recommendedAction}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-[#64748B]">Related Cases:</span>
                  {f.relatedCases.map(c => (
                    <span key={c} className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 11: Investigative Priorities ─────────── */}
        <div className="space-y-3">
          <SectionHeading icon={AlertOctagon} title="11. Investigative Priorities" />
          <div className="space-y-2">
            {report.investigativePriorities.map(p => (
              <div key={p.caseId} className="flex items-start justify-between text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded px-3 py-2.5 gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[#087E8B]">{p.caseId}</span>
                    <span className="font-semibold text-[#12304A]">— {p.caseName}</span>
                  </div>
                  <p className="text-[#64748B]">{p.reason}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {p.alertCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141]">{p.alertCount} Alerts</span>
                  )}
                  <SeverityBadge severity={p.priority as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 12: Data Quality ──────────────────────── */}
        <div className="space-y-3">
          <SectionHeading icon={CheckCircle2} title="12. Data Quality" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <StatBox value={report.dataQuality.totalRecordsReviewed} label="Records Reviewed" />
            <StatBox value={report.dataQuality.missingFields} label="Missing Fields" color="text-[#B7791F]" />
            <StatBox value={report.dataQuality.conflictingRecords} label="Conflicting Records" color="text-[#C24141]" />
            <StatBox value={report.dataQuality.unverifiedIdentities} label="Unverified Identities" color="text-[#B7791F]" />
            <StatBox value={report.dataQuality.pendingEvidenceAnalysis} label="Pending Analysis" color="text-[#64748B]" />
          </div>
        </div>

        {/* ── Section 13: Recent Audit Activity ───────────── */}
        <div className="space-y-3">
          <SectionHeading icon={Eye} title="13. Recent Audit Activity" />
          <div className="space-y-1">
            {report.recentAuditActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-[11px] px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                <span className="font-mono text-[#64748B] shrink-0">{a.timestamp.substring(0, 16).replace('T', ' ')}</span>
                <span className="text-[#087E8B] font-medium shrink-0">[{a.module}]</span>
                <span className="text-[#334155] truncate">{a.action}</span>
                <span className="text-[#94A3B8] shrink-0">{a.user}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-[#E2E8F0] text-[11px] text-[#64748B] italic bg-[#F8FAFC] p-4 rounded-md border border-[#E2E8F0]">
          <strong>STATUTORY NOTICE:</strong> {report.disclaimer}
        </div>

      </div>
    </div>
  );
};
