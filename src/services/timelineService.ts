import { fetchApi } from './api';
import { TimelineEvent } from '../types';

export interface BackendTimelineEvent {
  id: string;
  timestamp: string;
  source_entity: string;
  source_entity_type: string;
  relationship: string;
  target_entity: string;
  target_entity_type: string;
  source_record: string;
  confidence: number;
  category: string;
  is_anomaly: boolean;
  notes?: string;
  related_alert_ids: string[];
}

export const timelineService = {
  async getEvents(filter?: {
    caseId?: string;
    entityId?: string;
    relationshipType?: string;
    limit?: number;
  }): Promise<TimelineEvent[]> {
    const params = new URLSearchParams();
    params.append('case_id', filter?.caseId || 'CASE-1024');
    if (filter?.entityId) params.append('entity_id', filter.entityId);
    if (filter?.relationshipType && filter.relationshipType !== 'ALL') {
      params.append('relationship_type', filter.relationshipType);
    }
    if (filter?.limit) params.append('limit', filter.limit.toString());

    try {
      const backendEvents = await fetchApi<BackendTimelineEvent[]>(`/timeline?${params.toString()}`);
      return backendEvents.map(be => ({
        id: be.id,
        timestamp: be.timestamp,
        dateFormatted: new Date(be.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeFormatted: new Date(be.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sourceEntity: be.source_entity,
        sourceType: be.source_entity_type as any,
        relationship: be.relationship as any,
        targetEntity: be.target_entity,
        targetType: be.target_entity_type as any,
        sourceRecord: be.source_record,
        confidence: be.confidence,
        category: be.category as any,
        associatedCaseId: filter?.caseId || 'CASE-1024',
        flaggedAnomaly: be.is_anomaly,
        notes: be.notes || (be.is_anomaly ? 'Correlated with active analytical anomaly alert.' : undefined)
      }));
    } catch (err) {
      console.warn('FastAPI timeline fallback:', err);
      return [];
    }
  }
};
