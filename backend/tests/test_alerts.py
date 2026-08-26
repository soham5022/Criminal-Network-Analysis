from app.services.alert_service import alert_service
from app.services.timeline_service import timeline_service
from app.services.graph_service import graph_service
from app.api.network import populate_synthetic_data
from app.models.enums import AlertStatus

def test_alerts_and_timeline():
    populate_synthetic_data("CASE-1024", reset=True)
    
    # 1. Test Alerts
    alerts = alert_service.get_alerts(case_id="CASE-1024")
    assert len(alerts) >= 1
    
    first_alert = alerts[0]
    assert first_alert.status == AlertStatus.NEW
    assert len(first_alert.evidence) > 0
    assert len(first_alert.analytical_metrics) > 0

    # Test status update
    updated = alert_service.update_status(first_alert.id, AlertStatus.INVESTIGATING)
    assert updated is not None
    assert updated.status == AlertStatus.INVESTIGATING

    # 2. Test Timeline Events
    events = timeline_service.extract_timeline_events(
        edge_records=graph_service._edge_records,
        node_attrs=graph_service._node_attrs,
        case_id="CASE-1024"
    )
    assert len(events) > 0
    assert events[0].timestamp <= events[-1].timestamp
