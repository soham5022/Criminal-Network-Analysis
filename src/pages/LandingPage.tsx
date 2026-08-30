import React from 'react';
import { 
  Network, 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  CreditCard, 
  MapPin, 
  FileText, 
  Database, 
  Cpu, 
  Layers, 
  Activity, 
  Search, 
  CheckCircle2, 
  Lock, 
  Eye, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useInvestigation } from '../context/InvestigationContext';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useInvestigation();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#17212B] font-sans select-none overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#12304A] flex items-center justify-center text-white font-bold text-base shadow-sm">
              T
            </div>
            <div>
              <div className="font-bold text-sm text-[#12304A] tracking-tight flex items-center gap-1.5 font-sans">
                <span>TraceNet</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                  SIH PROTOTYPE
                </span>
              </div>
              <p className="text-[10px] text-[#64748B] hidden sm:block">
                AI-Powered Criminal Network Analysis Platform • Team TraceX
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#475569] font-medium">
            <button onClick={() => scrollToSection('about')} className="hover:text-[#12304A] transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#12304A] transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-[#12304A] transition-colors">
              Capabilities
            </button>
            <button onClick={() => scrollToSection('human-in-loop')} className="hover:text-[#12304A] transition-colors">
              Human-in-the-Loop
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-2 rounded-lg bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Investigator Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4F5] border border-[#A7DFE3] text-[11px] font-semibold text-[#087E8B]">
              <span className="w-2 h-2 rounded-full bg-[#087E8B]" />
              <span>AI-POWERED CRIMINAL NETWORK ANALYSIS PLATFORM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#12304A] tracking-tight leading-tight">
              TRACENET <br />
              <span className="text-[#087E8B]">
                AI-Powered Criminal Network Analysis & Digital Investigation Platform
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
              Connecting the dots in complex investigations. TraceNet integrates fragmented investigation records, maps multi-source entity relationships, and identifies explainable structural leads to accelerate decision-making for authorized personnel.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('login')}
                className="px-5 py-2.5 rounded-lg bg-[#087E8B] hover:bg-[#06636E] text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-[#087E8B]/20"
              >
                <span>Enter Investigation Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-5 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#12304A] border border-[#CBD5E1] font-semibold text-xs transition-colors shadow-sm"
              >
                How It Works
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="font-bold text-[#12304A] text-base">Multi-Source</div>
                <div className="text-[#64748B] text-[11px]">CDR, Banking & Logs</div>
              </div>
              <div>
                <div className="font-bold text-[#087E8B] text-base">Explainable</div>
                <div className="text-[#64748B] text-[11px]">Evidence-backed leads</div>
              </div>
              <div>
                <div className="font-bold text-[#16805C] text-base">Human-Led</div>
                <div className="text-[#64748B] text-[11px]">Officer decision control</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Simplified Investigation Network Map */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E2E8F0] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] text-xs text-[#64748B]">
                <span className="flex items-center gap-1.5 font-semibold text-[#12304A]">
                  <Network className="w-3.5 h-3.5 text-[#087E8B]" />
                  <span>INVESTIGATION NETWORK MAP</span>
                </span>
                <span className="text-[10px] text-[#B7791F] font-bold bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FCD34D]">
                  SYNTHETIC DEMO
                </span>
              </div>

              {/* Simplified Visual Node Diagram */}
              <div className="py-6 space-y-4">
                {/* Node Row 1 */}
                <div className="flex items-center justify-between px-4">
                  <div className="p-2.5 rounded-lg bg-[#EBF8FF] border border-[#BEE3F8] text-center w-28 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[#12304A] mx-auto mb-1" />
                    <div className="text-[11px] font-bold text-[#12304A] truncate">Vikram Singh</div>
                    <div className="text-[9px] text-[#64748B]">Finance Director</div>
                  </div>
                  <div className="text-[10px] text-[#087E8B] font-mono flex items-center gap-1">
                    <span>──[CALLED]──&gt;</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#E8F7F0] border border-[#A3E0C8] text-center w-28 shadow-sm">
                    <div className="w-2 h-2 rounded bg-[#16805C] mx-auto mb-1" />
                    <div className="font-mono text-[10px] font-bold text-[#16805C] truncate">+91 XXXXX 28471</div>
                    <div className="text-[9px] text-[#64748B]">Primary Mobile</div>
                  </div>
                </div>

                {/* Central Bridge Connection */}
                <div className="flex justify-center">
                  <div className="p-3 rounded-lg bg-[#E6F4F5] border-2 border-[#087E8B] text-center w-44 shadow-sm relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-[#087E8B] text-white font-bold text-[8px] uppercase">
                      BRIDGE NODE
                    </div>
                    <div className="text-xs font-bold text-[#12304A]">Rahul Sharma</div>
                    <div className="text-[10px] text-[#087E8B]">Logistics Coordinator</div>
                  </div>
                </div>

                {/* Node Row 2 */}
                <div className="flex items-center justify-between px-4">
                  <div className="p-2.5 rounded-lg bg-[#FEF3C7] border border-[#FCD34D] text-center w-28 shadow-sm">
                    <div className="w-2 h-2 rounded-sm rotate-45 bg-[#B7791F] mx-auto mb-1" />
                    <div className="font-mono text-[10px] font-bold text-[#B7791F] truncate">Acct ending 4821</div>
                    <div className="text-[9px] text-[#64748B]">Demo National Bank</div>
                  </div>
                  <div className="text-[10px] text-[#B7791F] font-mono flex items-center gap-1">
                    <span>&lt;──[WIRE]──</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F3E8FF] border border-[#E9D5FF] text-center w-28 shadow-sm">
                    <div className="w-2 h-2 rounded-none bg-[#7E22CE] mx-auto mb-1" />
                    <div className="text-[10px] font-bold text-[#7E22CE] truncate">Thane West Hub</div>
                    <div className="text-[9px] text-[#64748B]">Logistics Yard</div>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-[#E2E8F0] text-[10px] text-[#64748B] flex items-center justify-between">
                <span>Identified: 3 Communities Linked</span>
                <span className="text-[#16805C] font-bold">● High Centrality Lead</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Problem Section */}
      <section id="about" className="py-16 bg-[#FFFFFF] border-y border-[#E2E8F0] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E8B]">
              THE INVESTIGATION CHALLENGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
              INVESTIGATION DATA IS FRAGMENTED
            </h2>
            <p className="text-sm text-[#475569] leading-relaxed">
              Investigation information can come from multiple sources such as communication records, financial transactions, location/ANPR data and incident reports. When these sources are examined separately, relationships and patterns can be difficult to identify.
            </p>
          </div>

          {/* 4 Clean Problem Source Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 shadow-sm">
              <div className="p-2 w-fit rounded-lg bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#12304A]">COMMUNICATION</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                CDR logs, tower handshakes, IMEI mappings, and encrypted call records.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 shadow-sm">
              <div className="p-2 w-fit rounded-lg bg-[#FEF3C7] text-[#B7791F] border border-[#FCD34D]">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#12304A]">FINANCIAL</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Bank ledgers, sub-threshold smurfing relays, UPI transactions, and escrow accounts.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 shadow-sm">
              <div className="p-2 w-fit rounded-lg bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#12304A]">LOCATION</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                ANPR vehicle logs, physical checkpoint timestamps, and co-location hotspots.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 shadow-sm">
              <div className="p-2 w-fit rounded-lg bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-[#12304A]">REPORTS</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Incident reports, FIR narratives, witness statements, and corporate registry filings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Solution Process Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#087E8B]">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#12304A] tracking-tight">
            FROM RAW EVIDENCE TO INVESTIGATION DOSSIER
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#E6F4F5] text-[#087E8B] font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="text-xs font-bold text-[#12304A]">DATA INGESTION</h3>
            <p className="text-xs text-[#64748B]">
              Standardize multi-source CDRs, banking records, and ANPR scans into unified entities.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#E6F4F5] text-[#087E8B] font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="text-xs font-bold text-[#12304A]">NETWORK LINK ANALYSIS</h3>
            <p className="text-xs text-[#64748B]">
              Graph algorithms map communities and pinpoint structural bridge nodes between clusters.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#E6F4F5] text-[#087E8B] font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="text-xs font-bold text-[#12304A]">ANOMALY ALERTS</h3>
            <p className="text-xs text-[#64748B]">
              Algorithmic pattern detection flags rapid financial layering and burst telecom rotations.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#E6F4F5] text-[#087E8B] font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h3 className="text-xs font-bold text-[#12304A]">INTELLIGENCE REPORT</h3>
            <p className="text-xs text-[#64748B]">
              Generate complete, formal, court-admissible dossiers with cryptographic SHA-256 seals.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Human-In-The-Loop Section */}
      <section id="human-in-loop" className="py-16 bg-[#FFFFFF] border-t border-[#E2E8F0] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087E8B]">
              RESPONSIBLE LEA GOVERNANCE
            </span>
            <h2 className="text-2xl font-bold text-[#12304A]">
              Human-Led Investigative Oversight
            </h2>
            <p className="text-xs text-[#475569] leading-relaxed">
              TraceNet provides analytical assistance and investigative leads. All analytical scores and pattern detections require officer verification and do not determine legal culpability.
            </p>
          </div>

          <div className="lg:col-span-4 text-right">
            <button
              onClick={() => navigateTo('login')}
              className="px-6 py-3 rounded-lg bg-[#087E8B] hover:bg-[#06636E] text-white font-bold text-xs transition-colors shadow-md inline-flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to TraceNet</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-6 border-t border-[#E2E8F0] bg-[#F8FAFC] text-center text-xs text-[#64748B]">
        TraceNet — AI-Powered Criminal Network Analysis System • SIH Prototype • Designed for Authorized LEA Operation
      </footer>

    </div>
  );
};
