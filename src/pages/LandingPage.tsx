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
  UserCheck,
  Sparkles
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans select-none overflow-x-hidden">
      
      {/* 1. Header */}
      <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold font-mono text-base shadow-sm">
              T
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>TraceNet</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  SIH PROTOTYPE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                AI-Powered Criminal Network Analysis System // Team TraceX
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-white transition-colors">
              Capabilities
            </button>
            <button onClick={() => scrollToSection('human-in-loop')} className="hover:text-white transition-colors">
              Human-in-the-Loop
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('login')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-900/30"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Investigator Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>SIH PROTOTYPE • AI-POWERED INVESTIGATION ANALYSIS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              CONNECTING THE DOTS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">
                IN COMPLEX INVESTIGATIONS.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              TraceNet brings fragmented investigation data together, maps relationships between entities, and identifies explainable patterns that can help investigators prioritize leads.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('login')}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/40"
              >
                <span>Investigator Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
              >
                See How It Works
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <div className="font-bold text-white text-base">Multi-Source</div>
                <div className="text-slate-400 text-[11px]">CDR, Banking & Logs</div>
              </div>
              <div>
                <div className="font-bold text-blue-400 text-base">Explainable</div>
                <div className="text-slate-400 text-[11px]">Evidence-backed leads</div>
              </div>
              <div>
                <div className="font-bold text-emerald-400 text-base">Human-Led</div>
                <div className="text-slate-400 text-[11px]">Officer decision control</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: Simplified Investigation Network Map */}
          <div className="lg:col-span-5">
            <div className="intel-card p-5 rounded-2xl border border-slate-700/80 bg-[#090f1e] shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-blue-400" />
                  <span>INVESTIGATION NETWORK MAP</span>
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">SYNTHETIC DEMO</span>
              </div>

              {/* Simplified Visual Node Diagram */}
              <div className="py-6 space-y-4">
                {/* Node Row 1 */}
                <div className="flex items-center justify-between px-4">
                  <div className="p-2.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-center w-28">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mx-auto mb-1" />
                    <div className="font-mono text-[11px] font-bold text-white truncate">Vikram Singh</div>
                    <div className="text-[9px] text-slate-400">Finance Director</div>
                  </div>
                  <div className="text-[10px] text-blue-400 font-mono flex items-center gap-1">
                    <span>──[CALLED]──&gt;</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-center w-28">
                    <div className="w-2 h-2 rounded bg-emerald-400 mx-auto mb-1" />
                    <div className="font-mono text-[10px] font-bold text-white truncate">+91 XXXXX 28471</div>
                    <div className="text-[9px] text-slate-400">Primary Mobile</div>
                  </div>
                </div>

                {/* Central Bridge Connection */}
                <div className="flex justify-center">
                  <div className="p-3 rounded-xl bg-blue-900/40 border-2 border-sky-400 text-center w-40 shadow-lg shadow-sky-950/50 relative">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-sky-500 text-black font-bold text-[8px] uppercase">
                      BRIDGE NODE
                    </div>
                    <div className="font-mono text-xs font-bold text-white">Rahul Sharma</div>
                    <div className="text-[10px] text-sky-200">Logistics Coordinator</div>
                  </div>
                </div>

                {/* Node Row 2 */}
                <div className="flex items-center justify-between px-4">
                  <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-center w-28">
                    <div className="w-2 h-2 rounded-sm rotate-45 bg-amber-400 mx-auto mb-1" />
                    <div className="font-mono text-[10px] font-bold text-white truncate">Acct ending 4821</div>
                    <div className="text-[9px] text-slate-400">Demo National Bank</div>
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                    <span>&lt;──[WIRE]──</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-center w-28">
                    <div className="w-2 h-2 rounded-none bg-purple-400 mx-auto mb-1" />
                    <div className="font-mono text-[10px] font-bold text-white truncate">Thane West Hub</div>
                    <div className="text-[9px] text-slate-400">Logistics Yard</div>
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Identified: 3 Communities Linked</span>
                <span className="text-emerald-400 font-bold">● High Centrality Lead</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Problem Section */}
      <section id="about" className="py-16 bg-[#080d1a] border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              THE INVESTIGATION CHALLENGE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              INVESTIGATION DATA IS FRAGMENTED
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Investigation information can come from multiple sources such as communication records, financial transactions, location/ANPR data and incident reports. When these sources are examined separately, relationships and patterns can be difficult to identify.
            </p>
          </div>

          {/* 4 Clean Problem Source Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold font-mono text-white">COMMUNICATION</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                CDR logs, tower handshakes, IMEI mappings, and encrypted call records.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold font-mono text-white">FINANCIAL</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bank ledgers, sub-threshold smurfing relays, UPI transactions, and escrow accounts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold font-mono text-white">LOCATION</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ANPR vehicle logs, physical checkpoint timestamps, and co-location hotspots.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="p-2 w-fit rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold font-mono text-white">REPORTS</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Incident reports, FIR narratives, witness statements, and corporate registry filings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Solution Process Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            ONE CONNECTED INVESTIGATION VIEW
          </h2>
          <p className="text-sm text-slate-300">
            TraceNet transforms unstructured multi-source evidence into a structured knowledge graph to uncover operational patterns.
          </p>
        </div>

        {/* 6-Stage Process Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { step: '01', title: 'Multiple Data Sources', desc: 'Ingest CDR, SWIFT, ANPR & FIR records.' },
            { step: '02', title: 'Entity Extraction', desc: 'Identify persons, phones, accounts & assets.' },
            { step: '03', title: 'Knowledge Graph', desc: 'Map directed relationships in graph topology.' },
            { step: '04', title: 'Network Analysis', desc: 'Detect community modularity & centrality.' },
            { step: '05', title: 'Pattern Detection', desc: 'Flag smurfing, bridges & rendezvous.' },
            { step: '06', title: 'Explainable Leads', desc: 'Present actionable evidence for officer review.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative">
              <div className="font-mono text-xs font-bold text-blue-400">{item.step}</div>
              <h4 className="text-xs font-bold text-white">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              {idx < 5 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Capabilities Section */}
      <section id="capabilities" className="py-16 bg-[#080d1a] border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              CORE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              DESIGNED FOR LAW ENFORCEMENT & INVESTIGATORS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Database,
                title: '1. Multi-Source Analysis',
                desc: 'Combines disparate datasets (telecom, banking, surveillance) into a unified case knowledge file.'
              },
              {
                icon: Network,
                title: '2. Relationship Mapping',
                desc: 'Connects people, burner phones, bank ledgers, rendezvous points, and corporate front entities.'
              },
              {
                icon: Layers,
                title: '3. Network Community Analysis',
                desc: 'Calculates network modularity clusters and identifies high-betweenness structural bridge nodes.'
              },
              {
                icon: Activity,
                title: '4. Pattern Detection',
                desc: 'Surfaces financial structuring smurfing, temporal co-location convergence, and burst communications.'
              },
              {
                icon: ShieldCheck,
                title: '5. Explainable Findings',
                desc: 'Transparently explains why an entity was flagged with verifiable breakdown factors and source references.'
              },
              {
                icon: FileText,
                title: '6. Evidence & Timeline',
                desc: 'Traces analytical findings directly back to chronological event streams and verified source records.'
              }
            ].map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <div className="p-2 w-fit rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-white">{cap.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Human-in-the-Loop Section */}
      <section id="human-in-loop" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="p-8 rounded-2xl bg-[#090f1e] border border-slate-700/80 shadow-2xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" />
              <span>RESPONSIBLE AI GOVERNANCE</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              AI ASSISTS. INVESTIGATORS DECIDE.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              TraceNet generates analytical leads from available data. Investigators review the underlying relationships, timelines and source evidence before making decisions.
            </p>
          </div>

          {/* Visual Human-in-the-Loop Chain */}
          <div className="p-5 rounded-xl bg-[#070b14] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center flex-1 min-w-[120px]">
              <span className="text-slate-400 text-[10px] block">STEP 1</span>
              <strong className="text-white">RAW DATA</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center flex-1 min-w-[120px]">
              <span className="text-slate-400 text-[10px] block">STEP 2</span>
              <strong className="text-blue-400">TRACENET AI</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center flex-1 min-w-[120px]">
              <span className="text-slate-400 text-[10px] block">STEP 3</span>
              <strong className="text-amber-400">ANALYTICAL LEAD</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center flex-1 min-w-[120px]">
              <span className="text-slate-400 text-[10px] block">STEP 4</span>
              <strong className="text-cyan-400">EVIDENCE REVIEW</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />

            <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/50 text-center flex-1 min-w-[120px]">
              <span className="text-emerald-400 text-[10px] block font-bold">STEP 5</span>
              <strong className="text-emerald-300">OFFICER DECISION</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Small Demo Section */}
      <section className="py-12 bg-[#080d1a] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                PROTOTYPE DEMONSTRATION
              </span>
              <h3 className="text-lg font-bold text-white">FROM DATA TO INVESTIGATIVE LEAD</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              SYNTHETIC DEMO DATA
            </span>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block">1. Ingested Data:</span>
              <div className="font-semibold text-slate-200">CDR + SWIFT + ANPR</div>
              <div className="text-[11px] text-slate-400">2,410 calls, 1,820 transactions</div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block">2. Pattern Detected:</span>
              <div className="font-semibold text-blue-300">Multi-Cluster Bridge Lead</div>
              <div className="text-[11px] text-slate-400">Rahul Sharma connects 3 communities</div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block">3. Review Finding:</span>
              <div className="font-semibold text-amber-300">7 Cross-Community Links</div>
              <div className="text-[11px] text-slate-400">Betweenness Centrality: 0.61</div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-mono text-[10px] uppercase font-bold block">4. Supporting Evidence:</span>
              <div className="font-semibold text-emerald-300">Verified Ledgers</div>
              <div className="text-[11px] text-slate-400">CDR_00441, SWIFT #F-109</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-8 bg-[#060912] border-t border-slate-800 text-xs text-slate-400 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-white font-mono">TraceNet</div>
            <div className="text-[11px]">AI-Powered Criminal Network Analysis System • Team TraceX</div>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-500 space-y-0.5">
            <div>SIH Prototype Demonstration</div>
            <div>Synthetic data used for demonstration. This prototype provides analytical assistance and does not determine legal guilt.</div>
          </div>
        </div>
      </footer>

    </div>
  );
};
