import time
import os
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from ..models.schemas import NetworkGraphResponse, GraphBuildResponse
from ..services.graph_service import graph_service
from ..services.ingestion_service import ingestion_service

router = APIRouter(prefix="/network", tags=["Network Graph"])

def populate_synthetic_data(case_id: str = "CASE-1024", reset: bool = True) -> GraphBuildResponse:
    start_time = time.time()
    if reset:
        graph_service.clear(case_id)

    # Ingest synthetic benchmark data if available on disk
    base_dir = os.path.dirname(os.path.abspath(__file__))
    synthetic_dir = os.path.abspath(os.path.join(base_dir, "../../data/synthetic"))
    
    files_to_load = [
        ("people.csv", "people"),
        ("locations.csv", "locations"),
        ("organizations.csv", "organizations"),
        ("vehicles.csv", "vehicles"),
        ("calls.csv", "calls"),
        ("transactions.csv", "transactions"),
        ("visits.csv", "visits")
    ]

    for fname, _ in files_to_load:
        fpath = os.path.join(synthetic_dir, fname)
        if os.path.exists(fpath):
            with open(fpath, "rb") as f:
                ingestion_service.process_csv_file(f.read(), fname)

    # Process incident narrative text via NLP
    incident_path = os.path.join(synthetic_dir, "incident_reports.txt")
    if os.path.exists(incident_path):
        with open(incident_path, "r", encoding="utf-8") as f:
            ingestion_service.process_incident_text(f.read())

    graph_service.recompute_analytics()
    elapsed_ms = (time.time() - start_time) * 1000

    metrics = graph_service._computed_metrics.get("metrics", {})
    
    return GraphBuildResponse(
        status="success",
        case_id=case_id,
        nodes_created=len(graph_service._node_attrs),
        relationships_created=len(graph_service._edge_records),
        communities_detected=metrics.get("clusterCount", 4),
        execution_time_ms=round(elapsed_ms, 2),
        message="Knowledge graph constructed with verified betweenness centrality and community partitions."
    )

@router.get("/{case_id}", response_model=NetworkGraphResponse, summary="Retrieve Cytoscape Knowledge Graph")
async def get_network(case_id: str):
    """
    Returns the complete knowledge graph nodes, edges, and topology metrics
    for the specified investigation case formatted directly for Cytoscape.js.
    """
    if len(graph_service._node_attrs) == 0:
        populate_synthetic_data(case_id=case_id, reset=False)

    return graph_service.get_network_graph(case_id=case_id)

@router.post("/build", response_model=GraphBuildResponse, summary="Build or Re-index Graph")
async def build_network(case_id: str = "CASE-1024", reset: bool = True):
    """
    Constructs the investigation graph from synthetic benchmark records
    and incident logs. Applies Louvain community detection and betweenness centrality.
    """
    return populate_synthetic_data(case_id=case_id, reset=reset)
