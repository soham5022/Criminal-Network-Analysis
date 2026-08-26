import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  User, 
  Clock, 
  Tag, 
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';
import { noteService, Note } from '../../services/noteService';
import { useAuth } from '../../context/AuthContext';

export const InvestigationNotesView: React.FC<{ caseId: string; entityId?: string }> = ({ caseId, entityId }) => {
  const { user, canEdit } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newContent, setNewContent] = useState<string>('');
  const [targetEntity, setTargetEntity] = useState<string>(entityId || '');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await noteService.getNotes(caseId, entityId);
      setNotes(data);
    } catch (err) {
      console.warn('Notes fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [caseId, entityId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await noteService.addNote(caseId, newContent, targetEntity || undefined);
      setNotes(prev => [created, ...prev]);
      setNewContent('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 select-none max-w-4xl mx-auto">
      {/* Header */}
      <div className="intel-card p-4 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Investigator Field Notes & Case Collaboration ({notes.length} Recorded)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Case: <strong className="text-cyan-300">{caseId}</strong>
        </span>
      </div>

      {/* Add Note Form */}
      {canEdit && (
        <form onSubmit={handleAddNote} className="intel-card p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Record Intelligence Observation</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">Attach Entity:</span>
              <input
                type="text"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                placeholder="e.g. Person_044 (optional)"
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>
          </div>

          <textarea
            rows={3}
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Document suspect movements, financial layering hypotheses, or surveillance findings..."
            className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-slate-500">
              Posting as: <strong className="text-slate-300">{user?.name || 'Investigator'}</strong> ({user?.badge_number || 'MHA-INT-8902'})
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Recording...' : 'Add Note'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Notes Stream */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            Loading investigator notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="intel-card p-8 text-center text-xs font-mono text-slate-400 rounded-xl border border-slate-800">
            No notes recorded on this investigation yet.
          </div>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="intel-card p-4 rounded-xl border border-slate-800/90 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-300">{n.id}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{n.author}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
                    {n.author_badge}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {n.entity_id && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                      {n.entity_id}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(n.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1 border-t border-slate-800/60">
                {n.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
