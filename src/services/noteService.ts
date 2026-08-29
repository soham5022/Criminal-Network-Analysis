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

const LOCAL_STORAGE_KEY = 'tracenet_investigator_notes';

function getLocalNotes(): Note[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [
    {
      id: 'NOTE-001',
      case_id: 'CASE-1024',
      entity_id: 'Person_044',
      author: 'Inspector Rajesh Verma',
      author_badge: 'MHA-INT-8902',
      content: 'Initial graph analysis confirmed Rahul Sharma as the multi-cluster coordination bridge between financial accounts and logistics facilities. Priority surveillance requested.',
      created_at: '2026-08-26T10:15:00Z'
    },
    {
      id: 'NOTE-002',
      case_id: 'CASE-1031',
      entity_id: 'Phone_021',
      author: 'Deputy Director Neha Sengupta',
      author_badge: 'MHA-INT-4411',
      content: 'Burner SIM IMEI signatures match procurement logs in Sector 14. Synchronized cell tower dumps requested.',
      created_at: '2026-08-26T12:30:00Z'
    }
  ];
}

function saveLocalNotes(notes: Note[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

export const noteService = {
  async getNotes(caseId: string, entityId?: string): Promise<Note[]> {
    try {
      const params = new URLSearchParams();
      if (entityId) params.append('entity_id', entityId);
      return await fetchApi<Note[]>(`/cases/${encodeURIComponent(caseId)}/notes?${params.toString()}`);
    } catch (err) {
      console.warn(`FastAPI notes fallback for case ${caseId}:`, err);
      const all = getLocalNotes();
      let filtered = all.filter(n => n.case_id.toLowerCase() === caseId.toLowerCase());
      if (entityId) {
        filtered = filtered.filter(n => n.entity_id?.toLowerCase() === entityId.toLowerCase());
      }
      return filtered;
    }
  },

  async addNote(caseId: string, content: string, entityId?: string): Promise<Note> {
    try {
      return await fetchApi<Note>(`/cases/${encodeURIComponent(caseId)}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content, entity_id: entityId })
      });
    } catch (err) {
      console.warn(`FastAPI add note fallback for case ${caseId}:`, err);
      const newNote: Note = {
        id: `NOTE-${Date.now().toString().slice(-4)}`,
        case_id: caseId,
        entity_id: entityId,
        author: 'Inspector Rajesh Verma',
        author_badge: 'MHA-INT-8902',
        content: content,
        created_at: new Date().toISOString()
      };
      const all = getLocalNotes();
      all.unshift(newNote);
      saveLocalNotes(all);
      return newNote;
    }
  }
};
