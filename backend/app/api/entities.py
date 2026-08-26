from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from ..models.schemas import EntityDetail
from ..models.enums import EntityType, AnalyticalPriority
from ..services.graph_service import graph_service
from .network import populate_synthetic_data

router = APIRouter(prefix="/entities", tags=["Entity Intelligence"])

@router.get("", response_model=List[EntityDetail], summary="List Filtered Investigation Entities")
async def list_entities(
    type: Optional[EntityType] = None,
    priority: Optional[AnalyticalPriority] = None,
    community: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=100, le=500)
):
    """Retrieves list of extracted entities with centrality rankings and filters."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data(case_id="CASE-1024", reset=False)

    results: List[EntityDetail] = []
    for node_id in graph_service._node_attrs.keys():
        detail = graph_service.get_entity_detail(node_id)
        if not detail:
            continue

        if type and detail.type != type:
            continue
        if priority and detail.analytical_priority != priority:
            continue
        if community and community != "ALL" and detail.community != community:
            continue
        if search:
            q = search.lower()
            if q not in detail.id.lower() and q not in detail.label.lower():
                continue

        results.append(detail)
        if len(results) >= limit:
            break

    return results

@router.get("/{entity_id}", response_model=EntityDetail, summary="Get Single Entity Intelligence Dossier")
async def get_entity(entity_id: str):
    """Returns deep analytical metrics, bridge betweenness scores, and 1-hop connections for an entity."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data(case_id="CASE-1024", reset=False)

    detail = graph_service.get_entity_detail(entity_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found in investigation graph")
    return detail

@router.get("/{entity_id}/connections", summary="Get Entity Direct Neighborhood Connections")
async def get_entity_connections(entity_id: str):
    """Returns direct relationships and connected entity IDs."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data(case_id="CASE-1024", reset=False)

    detail = graph_service.get_entity_detail(entity_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found in investigation graph")
    return {
        "entity_id": detail.id,
        "connections_count": detail.connections_count,
        "key_connections": detail.key_connections,
        "direct_relationships": detail.direct_relationships
    }
