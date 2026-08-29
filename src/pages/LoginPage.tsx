import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  KeyRound, 
  Layers, 
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col justify-between select-none">
      
      {/* Top Bar with Back Button */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <button
          onClick={() => navigateTo('landing')}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>MHA INTEL NODE • ACTIVE</span>
        </div>
      </header>

      {/* Main Container Split View */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl intel-card rounded-2xl border border-slate-700/80 bg-[#090f1e] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Panel: Identity & Badges */}
          <div className="lg:col-span-5 p-8 bg-[#060a14] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold font-mono text-lg shadow-sm">
                  T
                </div>
                <div>
                  <h2 className="font-bold text-base text-white tracking-tight">TraceNet</h2>
                  <p className="text-[10px] text-slate-400 font-mono">Team TraceX</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
                  SECURE INVESTIGATOR ACCESS
                </span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "Connecting the dots in complex investigations."
                </p>
              </div>

              <div className="pt-2 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-mono text-[11px]">CASE ANALYSIS</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-[11px]">NETWORK INTELLIGENCE</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[11px]">EVIDENCE REVIEW</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono space-y-1">
              <div>Authorized personnel only.</div>
              <div>All access attempts logged in audit ledger.</div>
            </div>
          </div>

          {/* Right Panel: Sign In Form */}
          <div className="lg:col-span-7 p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white tracking-tight">Investigator Sign In</h3>
              <p className="text-xs text-slate-400">
                Sign in to access assigned investigation cases and network files.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  Official ID / Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@agency.gov.in"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 pr-9 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>

            {/* Quick Demo Presets */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Demo Environment Presets:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('investigator')}
                  className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-200 font-semibold text-center transition-colors"
                >
                  <div className="font-bold text-white truncate">Investigator</div>
                  <div className="text-[9px] text-blue-400 font-mono">Rajesh Verma</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-200 font-semibold text-center transition-colors"
                >
                  <div className="font-bold text-white truncate">Admin</div>
                  <div className="text-[9px] text-amber-400 font-mono">System Admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('viewer')}
                  className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-200 font-semibold text-center transition-colors"
                >
                  <div className="font-bold text-white truncate">Viewer</div>
                  <div className="text-[9px] text-slate-400 font-mono">Audit Officer</div>
                </button>
              </div>
            </div>

            {/* Security Indicators */}
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Secure session</span>
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
      <footer className="p-4 text-center text-[11px] font-mono text-slate-500">
        TraceNet — AI-Powered Criminal Network Analysis System • SIH Prototype
      </footer>

    </div>
  );
};
