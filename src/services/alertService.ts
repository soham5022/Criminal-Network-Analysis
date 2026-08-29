import { Alert, AlertSeverity, AlertStatus } from '../types';
import { fetchApi } from './api';
import { mockAlerts } from '../data/mockAlerts';

interface BackendAlert {
  id: string;
  case_id: string;
  pattern_type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  confidence: number;
  entity_ids: string[];
  title: string;
  description: string;
  explanation: string;
  evidence: string[];
  analytical_metrics: Array<{ metric_name: string; baseline_value: string; observed_value: string }>;
  related_entities: Array<{ id: string; label: string; type: string; role_in_alert: string }>;
  created_at: string;
  recommended_action: string;
}

const LOCAL_STORAGE_ALERTS_STATUS_KEY = 'tracenet_alert_status_cache';

function getStatusOverrides(): Record<string, AlertStatus> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ALERTS_STATUS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {};
}

function saveStatusOverride(alertId: string, status: AlertStatus) {
  try {
    const overrides = getStatusOverrides();
    overrides[alertId] = status;
    localStorage.setItem(LOCAL_STORAGE_ALERTS_STATUS_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

function mapBackendAlert(ba: BackendAlert): Alert {
  const overrides = getStatusOverrides();
  return {
    id: ba.id,
    title: ba.title,
    category: ba.pattern_type,
    severity: ba.severity,
    status: overrides[ba.id] || ba.status,
    timestamp: ba.created_at,
    reason: ba.description,
    explanation: ba.explanation,
    analyticalMetrics: ba.analytical_metrics.map(m => ({
      metricName: m.metric_name,
      baselineValue: m.baseline_value,
      observedValue: m.observed_value
    })),
    relatedEntities: ba.related_entities.map(re => ({
      id: re.id,
      label: re.label,
      type: re.type as any,
      roleInAlert: re.role_in_alert
    })),
    associatedCaseId: ba.case_id,
    recommendedAction: ba.recommended_action
  };
}

export const alertService = {
  async getAlerts(filter?: {
    severity?: AlertSeverity;
    status?: AlertStatus;
    caseId?: string;
    entityId?: string;
  }): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (filter?.severity) params.append('severity', filter.severity);
    if (filter?.status) params.append('status', filter.status);
    if (filter?.caseId) params.append('case_id', filter.caseId);
    if (filter?.entityId) params.append('entity_id', filter.entityId);

    const overrides = getStatusOverrides();

    try {
      const backendAlerts = await fetchApi<BackendAlert[]>(`/alerts?${params.toString()}`);
      return backendAlerts.map(mapBackendAlert);
    } catch (err) {
      console.warn('FastAPI alerts fallback:', err);
      let result = mockAlerts.map(a => ({
        ...a,
        status: overrides[a.id] || a.status
      }));

      if (filter?.severity) result = result.filter(a => a.severity === filter.severity);
      if (filter?.status) result = result.filter(a => a.status === filter.status);
      if (filter?.caseId) result = result.filter(a => a.associatedCaseId.toLowerCase() === filter.caseId!.toLowerCase());
      if (filter?.entityId) {
        result = result.filter(a => a.relatedEntities.some(e => e.id.toLowerCase() === filter.entityId!.toLowerCase()));
      }
      return result;
    }
  },

  async getAlertById(alertId: string): Promise<Alert | undefined> {
    const overrides = getStatusOverrides();
    try {
      const ba = await fetchApi<BackendAlert>(`/alerts/${encodeURIComponent(alertId)}`);
      return mapBackendAlert(ba);
    } catch (err) {
      const alert = mockAlerts.find(a => a.id === alertId);
      if (!alert) return undefined;
      return {
        ...alert,
        status: overrides[alert.id] || alert.status
      };
    }
  },

  async updateAlertStatus(alertId: string, status: AlertStatus): Promise<Alert> {
    saveStatusOverride(alertId, status);

    try {
      const ba = await fetchApi<BackendAlert>(`/alerts/${encodeURIComponent(alertId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ new_status: status })
      });
      return mapBackendAlert(ba);
    } catch (err) {
      const alert = mockAlerts.find(a => a.id === alertId);
      if (!alert) throw new Error(`Alert ${alertId} not found`);
      alert.status = status;
      return { ...alert, status };
    }
  }
};
