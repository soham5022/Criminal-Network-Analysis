import { fetchApi } from './api';

export interface Note {
  id: string;
  case_id: string;
  entity_id?: string;
  author: string;
  author_badge: string;
  content: string;
  created_at: string;
}

export const noteService = {
  async getNotes(caseId: string, entityId?: string): Promise<Note[]> {
    const params = new URLSearchParams();
    if (entityId) params.append('entity_id', entityId);
    return fetchApi<Note[]>(`/cases/${encodeURIComponent(caseId)}/notes?${params.toString()}`);
  },

  async addNote(caseId: string, content: string, entityId?: string): Promise<Note> {
    return fetchApi<Note>(`/cases/${encodeURIComponent(caseId)}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content, entity_id: entityId })
    });
  }
};
