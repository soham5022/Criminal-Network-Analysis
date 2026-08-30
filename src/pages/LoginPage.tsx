import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  FileText, 
  Network 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useInvestigation } from '../context/InvestigationContext';

export const LoginPage: React.FC = () => {
  const { login, loginAsInvestigator, loginAsAdmin, loginAsViewer } = useAuth();
  const { navigateTo } = useInvestigation();

  const [email, setEmail] = useState<string>('rajesh.verma@mha.gov.in');
  const [password, setPassword] = useState<string>('Investigator@2026!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberDevice, setRememberDevice] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your Official ID / Email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigateTo('dashboard');
    } catch (err: any) {
      console.warn('Login error:', err);
      setError('Invalid credentials. Please check your official ID and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'investigator' | 'admin' | 'viewer') => {
    setLoading(true);
    setError(null);
    try {
      if (role === 'investigator') await loginAsInvestigator();
      else if (role === 'admin') await loginAsAdmin();
      else await loginAsViewer();

      navigateTo('dashboard');
    } catch (err) {
      setError('Unable to authenticate with selected credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#17212B] font-sans flex flex-col justify-between select-none">
      
      {/* Top Bar with Back Button */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#12304A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#16805C] bg-[#E8F7F0] px-2.5 py-1 rounded-full border border-[#A3E0C8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16805C]" />
          <span>MHA SECURE NODE • ONLINE</span>
        </div>
      </header>

      {/* Main Container Split View */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Identity & Badges */}
          <div className="lg:col-span-5 p-8 bg-[#F8FAFC] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#12304A] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  T
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#12304A] tracking-tight">TraceNet</h2>
                  <p className="text-[10px] text-[#64748B]">Team TraceX • SIH Prototype</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3] inline-block">
                  SECURE INVESTIGATOR ACCESS
                </span>
                <p className="text-xs text-[#475569] italic leading-relaxed">
                  "Connecting the dots in complex investigations."
                </p>
              </div>

              <div className="pt-2 space-y-2.5 text-xs text-[#475569]">
                <div className="flex items-center gap-2.5 p-2 rounded-md bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
                  <FileText className="w-3.5 h-3.5 text-[#087E8B]" />
                  <span className="font-semibold text-[#12304A]">CASE ANALYSIS</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-md bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
                  <Network className="w-3.5 h-3.5 text-[#087E8B]" />
                  <span className="font-semibold text-[#12304A]">NETWORK INTELLIGENCE</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-md bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16805C]" />
                  <span className="font-semibold text-[#12304A]">EVIDENCE REGISTRY</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] text-[10px] text-[#64748B] space-y-1">
              <div>Authorized personnel only.</div>
              <div>All access attempts recorded in immutable audit log.</div>
            </div>
          </div>

          {/* Right Panel: Sign In Form */}
          <div className="lg:col-span-7 p-8 space-y-6 bg-[#FFFFFF]">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#12304A] tracking-tight">Investigator Sign In</h3>
              <p className="text-xs text-[#64748B]">
                Secure Investigation Workspace
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-md bg-[#FEE2E2] border border-[#FCA5A5] text-[#C24141] text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#12304A] block">
                  Official ID / Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.gov.in"
                  className="w-full px-3.5 py-2 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#17212B] text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] focus:ring-1 focus:ring-[#087E8B]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#12304A] block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 pr-9 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-[#17212B] text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] focus:ring-1 focus:ring-[#087E8B]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#12304A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#475569] text-xs">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#087E8B] focus:ring-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>

            {/* Quick Demo Presets */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                Demo Environment Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('investigator')}
                  className="p-2 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] text-[11px] font-semibold text-center transition-colors shadow-sm"
                >
                  <div className="font-bold text-[#12304A] truncate">Investigator</div>
                  <div className="text-[9px] text-[#087E8B]">Rajesh Verma</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] text-[11px] font-semibold text-center transition-colors shadow-sm"
                >
                  <div className="font-bold text-[#12304A] truncate">Admin</div>
                  <div className="text-[9px] text-[#B7791F]">System Admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('viewer')}
                  className="p-2 rounded-md bg-[#F8FAFC] hover:bg-[#E6F4F5] border border-[#E2E8F0] hover:border-[#A7DFE3] text-[11px] font-semibold text-center transition-colors shadow-sm"
                >
                  <div className="font-bold text-[#12304A] truncate">Viewer</div>
                  <div className="text-[9px] text-[#64748B]">Audit Officer</div>
                </button>
              </div>
            </div>

            {/* Security Indicators */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-[#64748B]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16805C]" />
                <span>Authorized Access</span>
              </span>
              <span>•</span>
              <span>Role-based access</span>
              <span>•</span>
              <span>Audit logging</span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-[11px] text-[#64748B]">
        TraceNet — AI-Powered Criminal Network Analysis System • SIH Prototype
      </footer>

    </div>
  );
};
