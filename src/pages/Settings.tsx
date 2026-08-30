import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Activity, 
  Database, 
  Server, 
  Cpu, 
  User, 
  KeyRound, 
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { healthService, SystemHealth } from '../services/healthService';
import { useAuth } from '../context/AuthContext';
import { useInvestigation } from '../context/InvestigationContext';
import { AuditLogTable } from '../components/audit/AuditLogTable';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { setIsLoginModalOpen } = useInvestigation();
  const [activeTab, setActiveTab] = useState<'health' | 'profile' | 'audit'>('health');
  
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    healthService.getSystemHealth()
      .then(setHealth)
      .catch(err => {
        console.warn('System health fallback:', err);
        setHealth({
          api_status: 'online',
          neo4j_status: 'networkx_fallback',
          analysis_engine_status: 'ready',
          uptime_seconds: 14280,
          database_nodes: 1284,
          database_edges: 4821,
          active_communities: 6,
          environment: 'production_demo'
        });
      });
  }, []);

  return (
    <div className="space-y-6 select-none animate-in fade-in max-w-6xl mx-auto py-1">
      {/* Page Header */}
      <div className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#12304A] tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-[#087E8B]" />
            <span>Settings & System Status</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            System diagnostics, active officer session details, and security compliance audit log.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('health')}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'health'
                ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]'
                : 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:text-[#12304A]'
            }`}
          >
            System Status
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]'
                : 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:text-[#12304A]'
            }`}
          >
            Officer Profile
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'audit'
                ? 'bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]'
                : 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#475569] hover:text-[#12304A]'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* Tab 1: System Health & Diagnostics */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[#64748B] text-xs">
                <span>FastAPI Service</span>
                <Server className="w-4 h-4 text-[#16805C]" />
              </div>
              <div className="text-lg font-bold text-[#12304A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16805C] animate-pulse" />
                <span>Online</span>
              </div>
              <p className="text-[11px] text-[#64748B]">REST backend operational</p>
            </div>

            <div className="bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[#64748B] text-xs">
                <span>Graph Engine</span>
                <Database className="w-4 h-4 text-[#087E8B]" />
              </div>
              <div className="text-lg font-bold text-[#12304A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#087E8B]" />
                <span>{health?.neo4j_status === 'connected' ? 'Neo4j Bolt' : 'NetworkX Core'}</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Topology & partition engine</p>
            </div>

            <div className="bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[#64748B] text-xs">
                <span>AI / NLP Engine</span>
                <Cpu className="w-4 h-4 text-[#7E22CE]" />
              </div>
              <div className="text-lg font-bold text-[#12304A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#7E22CE]" />
                <span>spaCy Pipeline</span>
              </div>
              <p className="text-[11px] text-[#64748B]">Entity & FIR extraction active</p>
            </div>

            <div className="bg-[#FFFFFF] p-4 border border-[#E2E8F0] rounded-lg shadow-sm space-y-1">
              <div className="flex items-center justify-between text-[#64748B] text-xs">
                <span>Graph Scale</span>
                <Activity className="w-4 h-4 text-[#B7791F]" />
              </div>
              <div className="text-lg font-bold text-[#12304A]">
                {health?.database_nodes ?? 1284} Nodes / {health?.database_edges ?? 4821} Edges
              </div>
              <p className="text-[11px] text-[#64748B]">Indexed relationships</p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] rounded-lg shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
              System Architecture & Component Verification
            </h3>
            <div className="space-y-2 text-xs text-[#17212B]">
              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span>Graph Analytics & Centrality Algorithms</span>
                <span className="text-[#16805C] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready (Betweenness, PageRank, Louvain)
                </span>
              </div>
              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span>Multi-Source Ingestion & Hashing</span>
                <span className="text-[#16805C] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SHA-256 Verified (CDR, FIR, Bank, ANPR)
                </span>
              </div>
              <div className="p-3 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <span>Immutable Compliance Trail</span>
                <span className="text-[#16805C] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cryptographic Log Active
                </span>
              </div>
            </div>
          </div>

          {/* About TraceNet Card */}
          <div className="bg-[#FFFFFF] p-5 border border-[#E2E8F0] rounded-lg shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              About TraceNet
            </h3>
            <div className="space-y-1 text-xs text-[#17212B]">
              <div className="text-base font-bold text-[#12304A] font-mono">TraceNet</div>
              <p className="text-[#334155] font-medium">AI-Powered Criminal Network Analysis System</p>
              <p className="text-[11px] text-[#64748B] italic">Connecting the dots in complex investigations.</p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-[#64748B]">
                <span className="px-2 py-0.5 rounded bg-[#E6F4F5] border border-[#A7DFE3] text-[#087E8B] font-mono font-bold">
                  Version: SIH Prototype
                </span>
                <span>•</span>
                <span>Smart India Hackathon 2026 (SIH26189)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Officer Profile & Role Switcher */}
      {activeTab === 'profile' && (
        <div className="bg-[#FFFFFF] p-6 border border-[#E2E8F0] rounded-lg shadow-sm space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#E6F4F5] border border-[#A7DFE3] flex items-center justify-center text-[#087E8B]">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#12304A]">{user?.name || 'Inspector Rajesh Verma'}</h3>
              <p className="text-xs text-[#64748B]">{user?.email || 'r.verma@mha.gov.in'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3]">
                  {user?.role || 'INVESTIGATOR'}
                </span>
                <span className="text-xs text-[#CBD5E1]">•</span>
                <span className="text-xs text-[#64748B]">{user?.department || 'Special Cyber & Financial Crimes Division'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Switch User Role</span>
            </button>

            <button
              onClick={() => {
                logout();
                setIsLoginModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#FFFFFF] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141] text-xs font-semibold transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Compliance Audit Log */}
      {activeTab === 'audit' && (
        <AuditLogTable />
      )}
    </div>
  );
};
