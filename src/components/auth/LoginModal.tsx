import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  X, 
  ArrowRight, 
  UserCheck, 
  KeyRound, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in select-none">
      <div className="w-full max-w-md intel-card rounded-xl border border-slate-700 bg-[#0c1322] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">TraceNet</h3>
              <p className="text-[11px] text-slate-300 font-medium">AI-Powered Criminal Network Analysis System</p>
              <p className="text-[10px] text-slate-400 italic">Connecting the dots in complex investigations.</p>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors self-start"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-start gap-2 text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Officer Email / User ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@mha.gov.in"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick Role Switcher for SIH Demonstration */}
          <div className="pt-3.5 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              1-Click Demonstration Profiles:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickRole(loginAsInvestigator)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-blue-500/40 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-blue-300">Investigator</div>
                <div className="text-[10px] text-slate-400 truncate">Insp. Verma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole(loginAsAdmin)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-amber-300">Director</div>
                <div className="text-[10px] text-slate-400 truncate">Dir. Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole(loginAsViewer)}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-slate-300">Analyst</div>
                <div className="text-[10px] text-slate-400 truncate">A. Patel</div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
