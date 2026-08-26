from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from ..models.schemas import TimelineEventSchema
from ..services.graph_service import graph_service
from ..services.timeline_service import timeline_service
from .network import populate_synthetic_data

router = APIRouter(prefix="/timeline", tags=["Timeline Intelligence"])

@router.get("", response_model=List[TimelineEventSchema], summary="Get Chronological Multi-Source Timeline Events")
async def get_timeline(
    case_id: str = Query(default="CASE-1024"),
    entity_id: Optional[str] = Query(default=None),
    relationship_type: Optional[str] = Query(default=None),
    limit: int = Query(default=200, le=1000)
):
    """
    Returns timestamped events extracted directly from graph relationships
    (CDR logs, Banking Wire relays, Surveillance visits, Incident FIR records).
    """
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data(case_id=case_id, reset=False)

    events = timeline_service.extract_timeline_events(
        edge_records=graph_service._edge_records,
        node_attrs=graph_service._node_attrs,
        case_id=case_id,
        entity_id=entity_id,
        rel_type=relationship_type
    )

    return events[:limit]
