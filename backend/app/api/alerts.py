from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Body
from ..models.schemas import AlertSchema
from ..models.enums import AlertSeverity, AlertStatus
from ..services.alert_service import alert_service
from ..services.graph_service import graph_service
from .network import populate_synthetic_data

router = APIRouter(prefix="/alerts", tags=["Pattern Anomaly Alerts"])

@router.get("", response_model=List[AlertSchema], summary="List Pattern Anomaly Alerts")
async def list_alerts(
    severity: Optional[AlertSeverity] = None,
    status: Optional[AlertStatus] = None,
    case_id: Optional[str] = Query(default="CASE-1024"),
    entity_id: Optional[str] = None
):
    """Retrieves explainable pattern alerts generated from graph topology anomalies."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data(case_id or "CASE-1024", reset=False)

    return alert_service.get_alerts(
        case_id=case_id,
        severity=severity,
        status=status,
        entity_id=entity_id
    )

@router.get("/{alert_id}", response_model=AlertSchema, summary="Get Single Alert Details")
async def get_alert(alert_id: str):
    """Retrieves detailed explainability breakdown and evidence for an alert."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data("CASE-1024", reset=False)

    alert = alert_service.get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found")
    return alert

@router.patch("/{alert_id}/status", response_model=AlertSchema, summary="Update Alert Triage Status")
async def update_alert_status(alert_id: str, new_status: AlertStatus = Body(..., embed=True)):
    """Updates an alert triage status (NEW -> INVESTIGATING -> REVIEWED -> DISMISSED)."""
    alert = alert_service.update_status(alert_id, new_status)
    if not alert:
        raise HTTPException(status_code=404, detail=f"Alert '{alert_id}' not found")
    return alert
