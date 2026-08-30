import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  User, 
  Plus
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
    <div className="space-y-5 select-none max-w-5xl mx-auto py-1">
      {/* Header */}
      <div className="p-4 border border-[#E2E8F0] rounded-lg flex items-center justify-between bg-[#FFFFFF] shadow-sm">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-[#087E8B]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#12304A]">
            Investigator Notes & Operational Observations ({notes.length} Recorded)
          </h2>
        </div>
        <span className="text-xs font-mono text-[#64748B]">
          Case: <strong className="text-[#087E8B]">{caseId}</strong>
        </span>
      </div>

      {/* Add Note Form */}
      {canEdit && (
        <form onSubmit={handleAddNote} className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#12304A] uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>Record Case Observation</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#64748B]">Attach Entity:</span>
              <input
                type="text"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                placeholder="e.g. Rahul Sharma (optional)"
                className="px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs font-mono text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] w-44"
              />
            </div>
          </div>

          <textarea
            rows={3}
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Record officer observation, verification notes, or lead follow-ups..."
            className="w-full p-3 rounded-md bg-[#FFFFFF] border border-[#CBD5E1] text-xs text-[#17212B] placeholder-[#94A3B8] focus:outline-none focus:border-[#087E8B] resize-none font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#64748B]">
              Author: <strong className="text-[#12304A]">{user?.name || 'Inspector Rajesh Verma'}</strong> ({user?.badge_number || 'MHA-8902'})
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#087E8B] hover:bg-[#06636E] text-white text-xs font-semibold tracking-wide transition-colors shadow-sm disabled:opacity-50"
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
          <div className="p-8 text-center text-xs text-[#64748B]">
            Loading investigator notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B] border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm">
            No notes recorded on this investigation yet.
          </div>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="p-4 border border-[#E2E8F0] rounded-lg bg-[#FFFFFF] shadow-sm space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#087E8B]">{n.id}</span>
                  <span className="text-[#CBD5E1]">•</span>
                  <span className="font-bold text-[#12304A] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#087E8B]" />
                    <span>{n.author}</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[10px] font-mono text-[#64748B]">
                    {n.author_badge || 'MHA-8902'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {n.entity_id && (
                    <span className="px-2 py-0.5 rounded bg-[#E6F4F5] text-[#087E8B] border border-[#A7DFE3] text-[10px] font-mono font-bold">
                      {n.entity_id}
                    </span>
                  )}
                  <span className="text-[11px] text-[#64748B] font-mono">
                    {new Date(n.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#334155] leading-relaxed font-sans pl-1">
                {n.content}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
