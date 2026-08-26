import logging
from typing import List, Optional, Dict, Any
from ..models.schemas import TimelineEventSchema
from .alert_service import alert_service

logger = logging.getLogger("nexus-intel.timeline_service")

class TimelineService:
    def extract_timeline_events(
        self, 
        edge_records: List[Dict[str, Any]], 
        node_attrs: Dict[str, Dict[str, Any]],
        case_id: str = "CASE-1024",
        entity_id: Optional[str] = None,
        rel_type: Optional[str] = None
    ) -> List[TimelineEventSchema]:
        """Extracts and sorts multi-source chronological events directly from graph relationships."""
        events: List[TimelineEventSchema] = []
        alerts = alert_service.get_alerts(case_id=case_id)

        for e in edge_records:
            s_id = str(e["source"])
            t_id = str(e["target"])
            r_type = str(e.get("type", "ASSOCIATED_WITH"))

            if entity_id:
                if s_id.lower() != entity_id.lower() and t_id.lower() != entity_id.lower():
                    continue

            if rel_type and rel_type != "ALL":
                if r_type.lower() != rel_type.lower():
                    continue

            s_type = node_attrs.get(s_id, {}).get("type", "PERSON")
            t_type = node_attrs.get(t_id, {}).get("type", "PERSON")

            # Check if this relationship is part of an active alert
            linked_alerts = [
                a.id for a in alerts 
                if (s_id in a.entity_ids and t_id in a.entity_ids) or s_id in a.entity_ids
            ]

            category = "COMMUNICATION"
            if r_type == "TRANSFERRED": category = "FINANCIAL"
            elif r_type in ["VISITED", "CO_LOCATED"]: category = "PHYSICAL_SURVEILLANCE"
            elif r_type in ["ASSOCIATED_WITH", "MET"]: category = "INTELLIGENCE_REPORT"

            events.append(TimelineEventSchema(
                id=f"EVT_{e['id']}",
                timestamp=e.get("timestamp", "2026-08-26T12:00:00"),
                source_entity=s_id,
                source_entity_type=s_type,
                relationship=r_type,
                target_entity=t_id,
                target_entity_type=t_type,
                source_record=e.get("source_type", "CDR"),
                confidence=float(e.get("confidence", 0.90)),
                category=category,
                is_anomaly=bool(e.get("is_anomaly", False) or len(linked_alerts) > 0),
                notes=e.get("properties", {}).get("notes"),
                related_alert_ids=linked_alerts[:2]
            ))

        # Sort chronologically
        events.sort(key=lambda x: x.timestamp)
        return events

timeline_service = TimelineService()
