import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  X, 
  ArrowLeft, 
  Download, 
  Plus, 
  Eye, 
  Loader2
} from 'lucide-react';
import { useInvestigation } from '../../context/InvestigationContext';
import { reportService, CaseReport, ReportConfig } from '../../services/reportService';
import { caseService } from '../../services/caseService';
import { Case } from '../../types';

// ─────────────────────────────────────────────────────────────
// Build the standalone printable HTML for one report
// ─────────────────────────────────────────────────────────────
function buildPrintHtml(report: CaseReport): string {
  const participantsHtml = report.participants.length > 0
    ? `
      <div class="rpt-section">
        <div class="rpt-section-heading">2. Case Participants Directory</div>
        <div class="rpt-participant-grid">
          ${report.participants.map(p => `
            <div class="rpt-participant-card">
              <strong style="color:#12304A">${p.name}</strong>
              <span style="font-size:8pt;color:#475569;display:block">${p.role.replace(/_/g, ' ')}</span>
              <span style="font-size:8.5pt;color:#64748B;display:block;margin-top:2pt">${p.roleDescription}</span>
              <span style="font-size:8pt;color:#087E8B;display:block;margin-top:2pt">${p.relevance}</span>
            </div>
          `).join('')}
        </div>
      </div>`
    : '';

  const witnessesHtml = report.witnesses.length > 0
    ? `
      <div class="rpt-section rpt-page-break-before">
        <div class="rpt-section-heading">3. Recorded Witness Depositions (Section 161 CrPC)</div>
        ${report.witnesses.map(w => `
          <div class="rpt-witness-card">
            <div style="display:flex;justify-content:space-between;margin-bottom:5pt">
              <strong style="color:#12304A">${w.name} (${w.id})</strong>
              <span style="font-family:monospace;font-size:8.5pt;color:#64748B">${w.relationshipToIncident}</span>
            </div>
            ${w.statements.map(st => `
              <div class="rpt-statement-card">
                <div style="display:flex;justify-content:space-between;color:#64748B;font-family:monospace;font-size:8pt;margin-bottom:3pt">
                  <span>Statement #${st.statementNumber} (${st.type})</span>
                  <span>${st.date} • ${st.time}</span>
                </div>
                <p style="margin:0;color:#17212B">${st.summary}</p>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>`
    : '';

  const evidenceHtml = report.evidence.length > 0
    ? `
      <div class="rpt-section">
        <div class="rpt-section-heading">4. Registered Digital Evidence &amp; Bitwise Integrity</div>
        ${report.evidence.map(ev => `
          <div class="rpt-evidence-row">
            <div>
              <span style="font-family:monospace;color:#087E8B;font-weight:700">${ev.id}: </span>
              <strong style="color:#12304A">${ev.title}</strong>
              <span style="color:#64748B;font-family:monospace;font-size:8pt;margin-left:6pt">(${ev.policeStation})</span>
            </div>
            <span style="color:#16805C;font-family:monospace;font-size:8.5pt;font-weight:600">
              ${ev.hasDigitalCopy ? 'SHA-256 Verified' : 'Registered in Ledger'}
            </span>
          </div>
        `).join('')}
      </div>`
    : '';

  const incidentHtml = report.incident
    ? `
      <div class="rpt-section">
        <div class="rpt-section-heading">1. Incident Dossier &amp; Statutory Filings</div>
        <div class="rpt-info-grid">
          <div class="rpt-info-cell">
            <span class="rpt-label">FIR Number &amp; Station</span>
            <span class="rpt-value">${report.incident.firNumber} (${report.incident.policeStation})</span>
          </div>
          <div class="rpt-info-cell">
            <span class="rpt-label">Incident Location &amp; Date</span>
            <span class="rpt-value">${report.incident.location} • ${report.incident.date}</span>
          </div>
        </div>
        <div class="rpt-prose">${report.incident.description}</div>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TRACENET — Official Report: ${report.id} — ${report.caseId}</title>
  <style>
    @page {
      margin: 20mm 18mm 20mm 18mm;
      size: A4 portrait;
    }

    * {
      box-sizing: border-box;
      color-adjust: exact;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
      color: #17212B;
      font-family: 'Times New Roman', Georgia, 'DejaVu Serif', serif;
      font-size: 11pt;
      line-height: 1.6;
    }

    .official-report {
      max-width: 100%;
      padding: 0;
    }

    .rpt-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-40deg);
      font-size: 72pt;
      font-weight: 900;
      color: rgba(8, 126, 139, 0.04);
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
      font-family: Arial, sans-serif;
    }

    .rpt-header {
      border-bottom: 2.5px solid #12304A;
      padding-bottom: 12pt;
      margin-bottom: 16pt;
      text-align: center;
      position: relative;
    }

    .rpt-header-banner {
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #087E8B;
      display: block;
      margin-bottom: 4pt;
      font-family: Arial, Helvetica, sans-serif;
    }

    .rpt-title {
      font-size: 17pt;
      font-weight: 700;
      color: #12304A;
      margin: 6pt 0 3pt 0;
    }

    .rpt-meta-row {
      font-family: 'Courier New', Courier, monospace;
      font-size: 8.5pt;
      color: #475569;
      margin-top: 4pt;
    }

    .rpt-metadata-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8pt;
      background: #F8FAFC;
      border: 1pt solid #CBD5E1;
      padding: 8pt;
      margin: 12pt 0;
      font-size: 9pt;
    }

    .rpt-section {
      margin-top: 16pt;
    }

    .rpt-section-heading {
      font-size: 9.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #12304A;
      border-bottom: 1pt solid #CBD5E1;
      padding-bottom: 3pt;
      margin-bottom: 8pt;
      font-family: Arial, Helvetica, sans-serif;
    }

    .rpt-prose {
      font-size: 10pt;
      color: #334155;
      background: #F8FAFC;
      border: 1pt solid #E2E8F0;
      padding: 8pt;
      margin: 6pt 0;
      line-height: 1.65;
    }

    .rpt-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6pt;
      margin-bottom: 8pt;
    }

    .rpt-info-cell {
      background: #F8FAFC;
      border: 1pt solid #E2E8F0;
      padding: 6pt;
    }

    .rpt-label {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748B;
      display: block;
      margin-bottom: 2pt;
      font-family: Arial, Helvetica, sans-serif;
    }

    .rpt-value {
      font-size: 10pt;
      font-weight: 600;
      color: #12304A;
    }

    .rpt-participant-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6pt;
      margin: 6pt 0;
    }

    .rpt-participant-card {
      background: #F8FAFC;
      border: 1pt solid #E2E8F0;
      padding: 6pt;
      page-break-inside: avoid;
      font-size: 9pt;
    }

    .rpt-witness-card {
      background: #F8FAFC;
      border: 1pt solid #E2E8F0;
      padding: 8pt;
      margin-bottom: 6pt;
      page-break-inside: avoid;
    }

    .rpt-statement-card {
      background: white;
      border: 1pt solid #CBD5E1;
      padding: 6pt;
      margin-top: 4pt;
      font-size: 9.5pt;
      page-break-inside: avoid;
    }

    .rpt-evidence-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #F8FAFC;
      border: 1pt solid #E2E8F0;
      padding: 5pt 8pt;
      margin-bottom: 3pt;
      font-size: 9pt;
      page-break-inside: avoid;
    }

    .rpt-disclaimer {
      margin-top: 20pt;
      padding: 8pt;
      border: 1pt solid #CBD5E1;
      background: #F8FAFC;
      font-size: 8.5pt;
      color: #475569;
      font-style: italic;
      page-break-inside: avoid;
    }

    .rpt-footer {
      margin-top: 16pt;
      padding-top: 8pt;
      border-top: 1pt solid #CBD5E1;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      font-family: 'Courier New', monospace;
      color: #64748B;
      page-break-inside: avoid;
    }

    .rpt-page-break-before {
      page-break-before: always;
    }

    @media print {
      body { print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="official-report">

    <div class="rpt-watermark">CONFIDENTIAL</div>

    <!-- Document Header -->
    <div class="rpt-header">
      <span class="rpt-header-banner">CONFIDENTIAL // LAW ENFORCEMENT INVESTIGATION DOSSIER</span>
      <div class="rpt-title">${report.title}</div>
      <div class="rpt-meta-row">
        REPORT REF: ${report.id} &nbsp;•&nbsp; CASE: ${report.caseId} &nbsp;•&nbsp; VERSION: ${report.version}.0
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="rpt-metadata-grid">
      <div>
        <span class="rpt-label">Case Name</span>
        <span class="rpt-value">${report.caseTitle}</span>
      </div>
      <div>
        <span class="rpt-label">Reporting Officer</span>
        <span class="rpt-value">${report.createdBy}</span>
      </div>
      <div>
        <span class="rpt-label">Generated Date</span>
        <span class="rpt-value" style="font-family:monospace">${report.createdDate} • ${report.createdTime}</span>
      </div>
      <div>
        <span class="rpt-label">Status</span>
        <span class="rpt-value" style="color:#16805C">${report.status}</span>
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="rpt-section">
      <div class="rpt-section-heading">Executive Summary</div>
      <div class="rpt-prose">${report.executiveSummary}</div>
    </div>

    <!-- Section 1: Incident -->
    ${incidentHtml}

    <!-- Section 2: Participants -->
    ${participantsHtml}

    <!-- Section 3: Witnesses -->
    ${witnessesHtml}

    <!-- Section 4: Evidence -->
    ${evidenceHtml}

    <!-- Statutory Disclaimer -->
    <div class="rpt-disclaimer">
      <strong>STATUTORY NOTICE:</strong> ${report.disclaimer}
    </div>

    <!-- Document Footer -->
    <div class="rpt-footer">
      <span>TraceNet Intelligence Platform — ${report.id}</span>
      <span>${report.caseId} — ${report.caseTitle}</span>
      <span>CONFIDENTIAL — LAW ENFORCEMENT ONLY</span>
    </div>

  </div>

  <script>
    window.onload = function() { window.print(); };
  </script>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// ReportGenerator component
// ─────────────────────────────────────────────────────────────
export const ReportGenerator: React.FC = () => {
  const { activeCaseId, setActiveCaseId } = useInvestigation();
  const [reports, setReports] = useState<CaseReport[]>([]);
  const [activeReport, setActiveReport] = useState<CaseReport | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'report'>('list');
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [allCases, setAllCases] = useState<Case[]>([]);

  // Generation modal state
  const [reportTitle, setReportTitle] = useState<string>('');
  const [reportType, setReportType] = useState<string>('Comprehensive Investigation Summary');
  const [configOptions, setConfigOptions] = useState({
    includeSummary: true,
    includeEntities: true,
    includeWitnesses: true,
    includeDocuments: true,
    includeEvidence: true,
    includeTimeline: true,
    includeNetwork: true,
    includeAlerts: true,
    includeActions: true,
    includeObservations: true,
    includeSources: true
  });

  const loadReports = () => {
    const list = reportService.getReportsByCase(activeCaseId);
    setReports(list);
    setActiveReport(list[0] || null);
  };

  useEffect(() => {
    setViewMode('list');
    loadReports();
  }, [activeCaseId]);

  useEffect(() => {
    caseService.getCases().then(setAllCases).catch(() => {});
  }, []);

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const steps = [
      'Collecting current case records...',
      'Compiling witness statements & depositions...',
      'Indexing registered evidence & SHA-256 seals...',
      'Building chronological timeline summary...',
      'Analyzing graph topology & cross-community leads...',
      'Finalizing confidential report...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      await new Promise(r => setTimeout(r, 250));
    }

    const config: ReportConfig = {
      caseId: activeCaseId,
      reportType,
      reportTitle: reportTitle || `${reportType} — ${activeCaseId}`,
      ...configOptions
    };

    const newReport = await reportService.generateCaseReport(activeCaseId, config);
    loadReports();
    setActiveReport(newReport);
    setIsGenerating(false);
    setShowGenerateModal(false);
    setViewMode('report');
  };

  const handleDownload = (report: CaseReport) => {
    let content = `# TRACENET INVESTIGATION REPORT\n`;
    content += `CONFIDENTIAL LAW ENFORCEMENT INTELLIGENCE\n\n`;
    content += `REPORT ID: ${report.id} (Version ${report.version})\n`;
    content += `CASE: ${report.caseId} — ${report.caseTitle}\n`;
    content += `TYPE: ${report.reportType}\n`;
    content += `GENERATED BY: ${report.createdBy} (${report.badgeNumber})\n`;
    content += `TIMESTAMP: ${report.createdDate} ${report.createdTime}\n\n`;
    content += `==================================================\n`;
    content += `EXECUTIVE SUMMARY\n`;
    content += `==================================================\n`;
    content += `${report.executiveSummary}\n\n`;

    if (report.incident) {
      content += `==================================================\n1. INCIDENT DETAILS\n==================================================\n`;
      content += `FIR Number: ${report.incident.firNumber}\n`;
      content += `Type: ${report.incident.incidentType}\n`;
      content += `Date/Time: ${report.incident.date} ${report.incident.time}\n`;
      content += `Location: ${report.incident.location}\n`;
      content += `Description: ${report.incident.description}\n\n`;
    }

    if (report.witnesses.length > 0) {
      content += `==================================================\n2. WITNESS STATEMENTS (Section 161 CrPC)\n==================================================\n`;
      report.witnesses.forEach(w => {
        content += `- Witness: ${w.name} (${w.id}) | Age: ${w.age} | ${w.relationshipToIncident}\n`;
        w.statements.forEach(st => {
          content += `  * Statement #${st.statementNumber} (${st.date}): ${st.summary}\n`;
        });
      });
      content += `\n`;
    }

    if (report.evidence.length > 0) {
      content += `==================================================\n3. REGISTERED DIGITAL EVIDENCE\n==================================================\n`;
      report.evidence.forEach(ev => {
        content += `- Evidence: ${ev.title} (${ev.id}) | ${ev.policeStation}\n`;
      });
      content += `\n`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_${report.caseId}_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ── Print handler: opens a new dedicated print window ──────
  const handlePrint = (report: CaseReport) => {
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this page and try again.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildPrintHtml(report));
    printWindow.document.close();
    // window.onload inside the print HTML triggers print() automatically
  };

  // ── REPORT VIEW ─────────────────────────────────────────────
  if (viewMode === 'report' && activeReport) {
    return (
      <div className="max-w-4xl mx-auto py-2 space-y-4 select-none animate-in fade-in">

        {/* Action Header — hidden on print */}
        <div className="no-print bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm flex items-center justify-between">
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#12304A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports List</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload(activeReport)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#12304A] text-xs font-semibold transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>Export Text</span>
            </button>
            <button
              onClick={() => handlePrint(activeReport)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Report</span>
            </button>
          </div>
        </div>

        {/* On-screen Paper Document (screen only — print uses popup window) */}
        <div className="bg-[#FFFFFF] p-8 sm:p-12 border border-[#CBD5E1] rounded-lg shadow-sm space-y-8 text-[#17212B]">

          {/* Header Banner */}
          <div className="border-b-2 border-[#12304A] pb-4 space-y-2 text-center">
            <div className="text-[11px] font-bold tracking-widest text-[#087E8B] uppercase">
              CONFIDENTIAL // LAW ENFORCEMENT INVESTIGATION DOSSIER
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#12304A]">
              {activeReport.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs text-[#64748B] font-mono pt-1">
              <span>REPORT REF: {activeReport.id}</span>
              <span>•</span>
              <span>CASE: {activeReport.caseId}</span>
              <span>•</span>
              <span>VERSION: {activeReport.version}.0</span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Case Name</span>
              <span className="font-semibold text-[#12304A]">{activeReport.caseTitle}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Reporting Officer</span>
              <span className="font-semibold text-[#12304A]">{activeReport.createdBy}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Generated Date</span>
              <span className="font-mono text-[#17212B]">{activeReport.createdDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">Status</span>
              <span className="font-bold text-[#16805C]">{activeReport.status}</span>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A] border-b border-[#E2E8F0] pb-1">
              Executive Summary
            </h3>
            <p className="text-xs text-[#334155] leading-relaxed font-sans bg-[#F8FAFC] p-4 rounded-md border border-[#E2E8F0]">
              {activeReport.executiveSummary}
            </p>
          </div>

          {/* Section 1: Incident Summary */}
          {activeReport.incident && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A] border-b border-[#E2E8F0] pb-1">
                1. Incident Dossier & Statutory Filings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">FIR Number & Station</span>
                  <span className="text-[#12304A] font-semibold">{activeReport.incident.firNumber} ({activeReport.incident.policeStation})</span>
                </div>
                <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block">Incident Location & Date</span>
                  <span className="text-[#12304A] font-semibold">{activeReport.incident.location} • {activeReport.incident.date}</span>
                </div>
              </div>
              <p className="text-xs text-[#334155] leading-relaxed font-sans bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0]">
                {activeReport.incident.description}
              </p>
            </div>
          )}

          {/* Section 2: Case Participants */}
          {activeReport.participants.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A] border-b border-[#E2E8F0] pb-1">
                2. Case Participants Directory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                {activeReport.participants.map(p => (
                  <div key={p.id} className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#12304A]">{p.name}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 rounded bg-[#FFFFFF] text-[#475569] border border-[#CBD5E1]">
                        {p.role.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#64748B]">{p.roleDescription}</div>
                    <div className="text-[10px] text-[#087E8B] font-mono truncate">{p.relevance}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Witnesses */}
          {activeReport.witnesses.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A] border-b border-[#E2E8F0] pb-1">
                3. Recorded Witness Depositions (Section 161 CrPC)
              </h3>
              <div className="space-y-2 text-xs">
                {activeReport.witnesses.map(w => (
                  <div key={w.id} className="p-3.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#12304A]">{w.name} ({w.id})</span>
                      <span className="text-[#64748B] font-mono text-[10px]">{w.relationshipToIncident}</span>
                    </div>
                    {w.statements.map(st => (
                      <div key={st.id} className="p-2.5 rounded bg-[#FFFFFF] border border-[#CBD5E1] text-[11px] space-y-1 shadow-sm">
                        <div className="flex items-center justify-between text-[#64748B] font-mono text-[10px]">
                          <span>Statement #{st.statementNumber} ({st.type})</span>
                          <span>{st.date} • {st.time}</span>
                        </div>
                        <p className="text-[#17212B] font-sans">{st.summary}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Registered Evidence */}
          {activeReport.evidence.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A] border-b border-[#E2E8F0] pb-1">
                4. Registered Digital Evidence & Bitwise Integrity
              </h3>
              <div className="space-y-1.5 text-xs">
                {activeReport.evidence.map(ev => (
                  <div key={ev.id} className="p-2.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[#087E8B] font-bold">{ev.id}: </span>
                      <span className="text-[#12304A] font-semibold">{ev.title}</span>
                      <span className="text-[#64748B] font-mono text-[10px] ml-2">({ev.policeStation})</span>
                    </div>
                    <span className="text-[#16805C] font-mono text-[11px] shrink-0 font-semibold">
                      {ev.hasDigitalCopy ? 'SHA-256 Verified' : 'Registered in Ledger'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statutory Disclaimer */}
          <div className="pt-4 border-t border-[#E2E8F0] text-[11px] text-[#64748B] italic bg-[#F8FAFC] p-4 rounded-md border border-[#E2E8F0]">
            <strong>STATUTORY NOTICE:</strong> {activeReport.disclaimer}
          </div>

        </div>
      </div>
    );
  }

  // ── REPORTS LIST ──────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto py-1 space-y-5 select-none animate-in fade-in">

      {/* Header Bar */}
      <div className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#087E8B]">{activeCaseId}</span>
            <span className="text-[#CBD5E1]">•</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              INTELLIGENCE BRIEFINGS
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#12304A] tracking-tight">
            Case Intelligence Reports & Briefings ({reports.length})
          </h1>
          <p className="text-xs text-[#64748B]">
            Formally compiled investigation dossiers referencing all case records, witness statements, and registered evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-medium">Case:</span>
            <select
              value={activeCaseId}
              onChange={(e) => setActiveCaseId(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-semibold text-[#12304A] focus:outline-none focus:border-[#087E8B] shadow-sm cursor-pointer"
            >
              {allCases.map((c) => (
                <option key={c.id} value={c.id}>
                  📁 {c.id} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Case Report</span>
          </button>
        </div>
      </div>

      {/* Reports Cards */}
      {reports.length === 0 ? (
        <div className="bg-[#FFFFFF] p-12 border border-[#E2E8F0] rounded-lg text-center space-y-2 shadow-sm">
          <FileText className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-bold text-[#12304A]">No Reports Generated</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            No intelligence briefings have been compiled for {activeCaseId} yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rpt) => (
            <div
              key={rpt.id}
              className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] rounded-lg hover:border-[#087E8B] transition-all space-y-3.5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#087E8B]">{rpt.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8F7F0] text-[#16805C] border border-[#A3E0C8]">
                    Version {rpt.version}.0 • {rpt.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#12304A]">{rpt.title}</h3>
                <div className="text-xs text-[#64748B]">{rpt.reportType}</div>
                <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed font-sans">
                  {rpt.executiveSummary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="text-[11px] text-[#64748B] font-mono">
                  {rpt.createdDate} • {rpt.createdBy}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveReport(rpt);
                      setViewMode('report');
                    }}
                    className="px-3 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>
                  <button
                    onClick={() => handlePrint(rpt)}
                    className="p-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#12304A] border border-[#CBD5E1] transition-colors shadow-sm"
                    title="Print Official Report"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownload(rpt)}
                    className="p-1.5 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#475569] hover:text-[#12304A] border border-[#CBD5E1] transition-colors shadow-sm"
                    title="Download Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Generate Case Report */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
          <div
            className="w-full max-w-lg bg-[#FFFFFF] rounded-lg border border-[#CBD5E1] shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#087E8B]">{activeCaseId}</span>
                <h3 className="font-bold text-sm text-[#12304A]">Generate Official Case Report</h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-[#64748B] hover:text-[#12304A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isGenerating ? (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#087E8B] animate-spin mx-auto" />
                <div className="font-bold text-[#12304A] text-sm">{generationStep}</div>
                <div className="text-xs text-[#64748B]">Compiling multi-source investigation ledger...</div>
              </div>
            ) : (
              <form onSubmit={handleGenerateSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#64748B]">Report Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operation Meridian Comprehensive Case Summary"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-[#64748B]">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] focus:outline-none focus:border-[#087E8B]"
                  >
                    <option value="Comprehensive Investigation Summary">Comprehensive Investigation Summary</option>
                    <option value="Evidentiary Court Deposition Briefing">Evidentiary Court Deposition Briefing</option>
                    <option value="Inter-Agency Operational Briefing">Inter-Agency Operational Briefing</option>
                  </select>
                </div>

                <div className="space-y-2 pt-1 border-t border-[#E2E8F0]">
                  <span className="block text-[10px] uppercase font-bold text-[#64748B]">Include Sections:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#475569]">
                    {Object.entries(configOptions).map(([key, val]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={() => setConfigOptions(prev => ({ ...prev, [key]: !val }))}
                          className="rounded bg-[#FFFFFF] border-[#CBD5E1] text-[#087E8B] focus:ring-0"
                        />
                        <span>{key.replace('include', '')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] text-xs font-semibold shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-bold shadow-sm"
                  >
                    Generate Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
