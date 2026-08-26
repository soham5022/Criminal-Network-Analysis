import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  X, 
  ArrowRight, 
  UserCheck, 
  KeyRound,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useInvestigation } from '../../context/InvestigationContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen } = useInvestigation();
  const { login, loginAsInvestigator, loginAsAdmin, loginAsViewer, user } = useAuth();
  
  const [email, setEmail] = useState<string>('rajesh.verma@mha.gov.in');
  const [password, setPassword] = useState<string>('Investigator@2026!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      setIsLoginModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRole = async (roleFn: () => Promise<void>) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await roleFn();
      setIsLoginModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md intel-card rounded-2xl border border-slate-700/80 bg-[#090f1e] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">NEXUS INTEL Authentication</h3>
              <p className="text-xs text-slate-400 font-mono">Ministry of Home Affairs • SIH26189</p>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Investigator Email / Official ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@mha.gov.in"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In with JWT'}</span>
            </button>
          </form>

          {/* Quick Role Switcher for SIH Presentation */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              1-Click Demo Profiles (Judge Shortcuts):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole(loginAsInvestigator)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-cyan-500/40 text-left transition-colors group"
              >
                <div className="text-[11px] font-bold text-cyan-300 group-hover:text-cyan-200">Investigator</div>
                <div className="text-[9px] text-slate-400 truncate">Insp. Verma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole(loginAsAdmin)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-purple-500/40 text-left transition-colors group"
              >
                <div className="text-[11px] font-bold text-purple-300 group-hover:text-purple-200">Director</div>
                <div className="text-[9px] text-slate-400 truncate">Admin Menon</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole(loginAsViewer)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-left transition-colors group"
              >
                <div className="text-[11px] font-bold text-slate-300 group-hover:text-white">Analyst</div>
                <div className="text-[9px] text-slate-400 truncate">Viewer Nair</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
