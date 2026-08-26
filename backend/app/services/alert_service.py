import logging
from typing import List, Optional, Dict, Any
from ..models.schemas import AlertSchema, DetectedPattern
from ..models.enums import AlertSeverity, AlertStatus, PatternType

logger = logging.getLogger("nexus-intel.alert_service")

class AlertService:
    def __init__(self):
        self._alerts_db: Dict[str, AlertSchema] = {}

    def generate_alerts_from_patterns(
        self, 
        patterns: List[DetectedPattern], 
        node_attrs: Dict[str, Dict[str, Any]], 
        case_id: str = "CASE-1024"
    ) -> List[AlertSchema]:
        """Converts detected graph patterns into explainable structured investigation alerts."""
        alerts: List[AlertSchema] = []

        for idx, pat in enumerate(patterns):
            alert_id = f"ALT-{9041 + idx:04d}"
            
            # Map involved entities with roles
            related = []
            for e_id in pat.involved_entity_ids:
                ent_type = node_attrs.get(e_id, {}).get("type", "PERSON")
                role = "Primary Focus Node" if e_id == pat.primary_entity_id else "Linked Counterparty"
                related.append({
                    "id": e_id,
                    "label": node_attrs.get(e_id, {}).get("label", e_id),
                    "type": ent_type,
                    "role_in_alert": role
                })

            # Analytical metrics
            metrics_formatted = [
                {
                    "metric_name": k.replace("_", " ").title(),
                    "baseline_value": "Network Baseline",
                    "observed_value": str(v)
                }
                for k, v in pat.metrics.items()
            ]

            # Recommended investigative action
            action = "Inspect communication records and financial logs between identified counterparties."
            if pat.pattern_type == PatternType.CROSS_COMMUNITY_BRIDGE:
                action = f"Cross-verify synchronization between {pat.primary_entity_id} and inter-cluster liaison points."
            elif pat.pattern_type == PatternType.TRANSACTION_ANOMALY:
                action = "Request expedited banking audit ledgers to trace origin of structured cash flows."
            elif pat.pattern_type == PatternType.TEMPORAL_CORRELATION:
                action = "Review ANPR toll and CCTV surveillance footage for the corresponding 8-hour window."
            elif pat.pattern_type == PatternType.DENSE_NETWORK_CLUSTER:
                action = "Subpoena registry corporate filings for all entities participating in the cluster."

            alert = AlertSchema(
                id=alert_id,
                case_id=case_id,
                pattern_type=pat.pattern_type,
                severity=pat.severity,
                status=AlertStatus.NEW,
                confidence=pat.confidence,
                entity_ids=pat.involved_entity_ids,
                title=pat.title,
                description=pat.evidence[0] if pat.evidence else "Graph anomaly flagged.",
                explanation=pat.explanation,
                evidence=pat.evidence,
                analytical_metrics=metrics_formatted,
                related_entities=related,
                created_at=pat.timestamp,
                recommended_action=action
            )
            
            self._alerts_db[alert_id] = alert
            alerts.append(alert)

        return alerts

    def get_alerts(
        self, 
        case_id: Optional[str] = None, 
        severity: Optional[AlertSeverity] = None, 
        status: Optional[AlertStatus] = None,
        entity_id: Optional[str] = None
    ) -> List[AlertSchema]:
        results = list(self._alerts_db.values())
        if case_id:
            results = [a for a in results if a.case_id.lower() == case_id.lower()]
        if severity:
            results = [a for a in results if a.severity == severity]
        if status:
            results = [a for a in results if a.status == status]
        if entity_id:
            results = [a for a in results if any(e.lower() == entity_id.lower() for e in a.entity_ids)]
        return results

    def get_alert_by_id(self, alert_id: str) -> Optional[AlertSchema]:
        return self._alerts_db.get(alert_id)

    def update_status(self, alert_id: str, new_status: AlertStatus) -> Optional[AlertSchema]:
        alert = self._alerts_db.get(alert_id)
        if alert:
            alert.status = new_status
            self._alerts_db[alert_id] = alert
        return alert

alert_service = AlertService()
