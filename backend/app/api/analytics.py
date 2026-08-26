import time
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from ..models.schemas import (
    CommunityDetail,
    BridgeEntity,
    DetectedPattern,
    AnalysisExecutionTelemetry,
    EntityDetail
)
from ..services.graph_service import graph_service
from ..services.alert_service import alert_service
from .network import populate_synthetic_data

router = APIRouter(prefix="/analytics", tags=["Graph Intelligence & Analytics"])

@router.post("/run", response_model=AnalysisExecutionTelemetry, summary="Run Full Graph Intelligence Pipeline")
async def run_analytics(case_id: str = "CASE-1024", force_reload: bool = False):
    """
    Executes the complete Graph Intelligence pipeline:
    1. Loads / syncs graph entities & relationships
    2. Runs Louvain / Modularity Community Detection
    3. Computes Degree, Betweenness, Closeness, PageRank
    4. Identifies Cross-Community Bridges
    5. Discovers 6 Core Anomaly Patterns
    6. Computes Explainable Analytical Attention Scores (0-100)
    7. Generates & stores Explainable Alerts
    """
    start_time = time.time()
    
    if force_reload or len(graph_service._node_attrs) == 0:
        populate_synthetic_data(case_id=case_id, reset=True)
    else:
        graph_service.recompute_analytics()

    elapsed = time.time() - start_time
    alerts = alert_service.get_alerts(case_id=case_id)

    return AnalysisExecutionTelemetry(
        status="success",
        case_id=case_id,
        records_processed=len(graph_service._edge_records) + len(graph_service._node_attrs),
        entities_discovered=len(graph_service._node_attrs),
        relationships_found=len(graph_service._edge_records),
        communities_detected=len(graph_service._communities_list),
        patterns_detected=len(graph_service._detected_patterns),
        alerts_generated=len(alerts),
        analysis_duration_seconds=round(elapsed, 3),
        timestamp=datetime.now().isoformat()
    )

@router.get("/communities", response_model=List[CommunityDetail], summary="Get Detected Network Communities")
async def get_communities():
    """Returns all algorithmically detected community clusters with sizes, densities, and internal distributions."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data("CASE-1024", reset=False)

    return graph_service._communities_list

@router.get("/bridges", response_model=List[BridgeEntity], summary="Get Cross-Community Bridge Entities")
async def get_bridges():
    """Returns detected bridge coordinator entities connecting multiple distinct network communities."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data("CASE-1024", reset=False)

    return graph_service._bridge_entities

@router.get("/patterns", response_model=List[DetectedPattern], summary="Get Detected Anomaly Patterns")
async def get_patterns():
    """Returns all 6 core detected patterns with evidence and method explanations."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data("CASE-1024", reset=False)

    return graph_service._detected_patterns

@router.get("/network-summary", summary="Get Global Network Analytics Summary")
async def get_network_summary():
    """Returns baseline density, total clusters, average degree, and bridge counts."""
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data("CASE-1024", reset=False)

    metrics = graph_service._computed_metrics.get("metrics", {})
    return {
        "total_nodes": len(graph_service._node_attrs),
        "total_edges": len(graph_service._edge_records),
        "baseline_density": metrics.get("density", 0.0),
        "average_degree": metrics.get("avgDegree", 0.0),
        "average_betweenness": metrics.get("avgBetweenness", 0.0),
        "communities_count": len(graph_service._communities_list),
        "bridges_count": len(graph_service._bridge_entities),
        "patterns_detected_count": len(graph_service._detected_patterns),
        "active_alerts_count": len(alert_service.get_alerts(case_id="CASE-1024"))
    }

@router.get("/entity/{entity_id}", response_model=EntityDetail, summary="Get Single Entity Attention Breakdown")
async def get_entity_analytics(entity_id: str):
    """Returns detailed analytical attention scoring (0-100), contributing factors, and bridge metrics."""
    detail = graph_service.get_entity_detail(entity_id)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Entity '{entity_id}' not found")
    return detail
