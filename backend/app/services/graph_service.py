import logging
import networkx as nx
from typing import Dict, List, Any, Optional
from ..core.database import db_manager
from ..core.config import settings
from ..models.enums import EntityType, RelationshipType, AnalyticalPriority
from ..models.schemas import (
    CytoscapeNode, 
    CytoscapeNodeData, 
    CytoscapeEdge, 
    CytoscapeEdgeData, 
    GraphMetrics, 
    NetworkGraphResponse, 
    EntityDetail,
    CommunityDetail,
    BridgeEntity,
    CrossCommunityLink,
    DetectedPattern,
    AttentionScoreFactor
)
from .graph_analysis_service import graph_analysis_service
from .community_service import community_service
from .pattern_detection_service import pattern_detection_service
from .attention_scoring_service import attention_scoring_service
from .alert_service import alert_service

logger = logging.getLogger("nexus-intel.graph_service")

class GraphService:
    def __init__(self):
        self._graph: nx.MultiDiGraph = nx.MultiDiGraph()
        self._node_attrs: Dict[str, Dict[str, Any]] = {}
        self._edge_records: List[Dict[str, Any]] = []
        
        # Cached Phase 3 Intelligence State
        self._computed_metrics: Dict[str, Any] = {}
        self._node_to_community: Dict[str, str] = {}
        self._communities_list: List[CommunityDetail] = []
        self._cross_links: List[CrossCommunityLink] = []
        self._bridge_entities: List[BridgeEntity] = []
        self._detected_patterns: List[DetectedPattern] = []
        self._node_attention: Dict[str, Dict[str, Any]] = {}

    @property
    def _detected_communities(self) -> List[CommunityDetail]:
        return self._communities_list

    def clear(self, case_id: Optional[str] = None):
        self._graph.clear()
        self._node_attrs.clear()
        self._edge_records.clear()
        self._computed_metrics.clear()
        self._node_to_community.clear()
        self._communities_list.clear()
        self._cross_links.clear()
        self._bridge_entities.clear()
        self._detected_patterns.clear()
        self._node_attention.clear()

        if db_manager.is_connected and db_manager.driver:
            try:
                with db_manager.driver.session(database=settings.NEO4J_DATABASE) as session:
                    session.run("MATCH (n) DETACH DELETE n")
                    logger.info("Cleared Neo4j graph database.")
            except Exception as e:
                logger.error(f"Error clearing Neo4j database: {e}")

    def add_node(self, node_id: str, label: str, node_type: EntityType, properties: Optional[Dict[str, Any]] = None):
        props = properties or {}
        self._graph.add_node(node_id, type=node_type.value, label=label, **props)
        self._node_attrs[node_id] = {
            "id": node_id,
            "label": label,
            "type": node_type.value,
            "properties": props
        }

        # Sync to Neo4j if online
        if db_manager.is_connected and db_manager.driver:
            try:
                label_cap = node_type.value.capitalize()
                cypher = f"""
                MERGE (n:{label_cap} {{id: $id}})
                SET n.label = $label, n += $props
                """
                with db_manager.driver.session(database=settings.NEO4J_DATABASE) as session:
                    session.run(cypher, id=node_id, label=label, props=props)
            except Exception as e:
                logger.debug(f"Neo4j add_node error: {e}")

    def add_relationship(
        self, 
        source: str, 
        target: str, 
        rel_type: RelationshipType, 
        rel_id: Optional[str] = None, 
        timestamp: str = "2026-08-26T12:00:00", 
        confidence: float = 0.90, 
        source_type: str = "CDR", 
        properties: Optional[Dict[str, Any]] = None
    ):
        props = properties or {}
        edge_id = rel_id or f"rel_{source}_{target}_{len(self._edge_records) + 1}"
        
        self._graph.add_edge(
            source, 
            target, 
            key=edge_id, 
            type=rel_type.value, 
            timestamp=timestamp, 
            confidence=confidence, 
            source_type=source_type, 
            **props
        )

        edge_data = {
            "id": edge_id,
            "source": source,
            "target": target,
            "type": rel_type.value,
            "timestamp": timestamp,
            "confidence": confidence,
            "source_type": source_type,
            "is_anomaly": props.get("flagged_anomaly", False),
            "properties": props
        }
        self._edge_records.append(edge_data)

        # Sync to Neo4j if online
        if db_manager.is_connected and db_manager.driver:
            try:
                cypher = f"""
                MATCH (s {{id: $source}}), (t {{id: $target}})
                MERGE (s)-[r:{rel_type.value} {{id: $edge_id}}]->(t)
                SET r.timestamp = $timestamp, r.confidence = $confidence, r.source_type = $source_type, r += $props
                """
                with db_manager.driver.session(database=settings.NEO4J_DATABASE) as session:
                    session.run(cypher, source=source, target=target, edge_id=edge_id, timestamp=timestamp, confidence=confidence, source_type=source_type, props=props)
            except Exception as e:
                logger.debug(f"Neo4j add_relationship error: {e}")

    def recompute_analytics(self):
        """Executes full Phase 3 Graph Intelligence Engine."""
        if len(self._node_attrs) == 0:
            return

        undirected = nx.Graph(self._graph)

        # 1. Centrality & PageRank
        self._computed_metrics = graph_analysis_service.compute_all_metrics(undirected)

        # 2. Modularity Communities, Cross-Links & Bridges
        node_to_comm, comm_details, cross_links, bridges = community_service.detect_communities(
            undirected,
            self._node_attrs,
            self._edge_records,
            self._computed_metrics
        )
        self._node_to_community = node_to_comm
        self._communities_list = comm_details
        self._cross_links = cross_links
        self._bridge_entities = bridges

        # 3. Detect 6 Core Anomaly Patterns
        self._detected_patterns = pattern_detection_service.detect_all_patterns(
            self._node_attrs,
            self._edge_records,
            self._communities_list,
            self._bridge_entities,
            self._cross_links,
            self._computed_metrics
        )

        # 4. Generate & Store Alerts
        alert_service.generate_alerts_from_patterns(
            self._detected_patterns,
            self._node_attrs,
            case_id="CASE-1024"
        )

        # 5. Compute Explainable Analytical Attention Score per Entity
        bridge_map = {b.entity_id: b for b in self._bridge_entities}
        dense_comms = {c.community_id for c in self._communities_list if c.is_unusually_dense}
        anomaly_entities = set()
        for p in self._detected_patterns:
            anomaly_entities.update(p.involved_entity_ids)

        bet_map = self._computed_metrics.get("betweenness_centrality", {})
        deg_map = self._computed_metrics.get("degree_centrality", {})
        cl_map = self._computed_metrics.get("closeness_centrality", {})
        pr_map = self._computed_metrics.get("pagerank", {})

        self._node_attention.clear()
        for node_id in self._node_attrs.keys():
            b_info = bridge_map.get(node_id)
            cross_cnt = b_info.cross_community_links_count if b_info else 0
            comm_cnt = b_info.communities_connected_count if b_info else 1
            is_dense = (self._node_to_community.get(node_id, "") in dense_comms)
            is_anom = (node_id in anomaly_entities)
            
            # Count connections
            conn_count = self._graph.degree(node_id) if node_id in self._graph else 0
            b_val = float(bet_map.get(node_id, 0.0))
            d_val = float(deg_map.get(node_id, 0.0))

            score, priority, factors = attention_scoring_service.calculate_score(
                node_id=node_id,
                betweenness=b_val,
                degree=d_val,
                cross_community_links=cross_cnt,
                communities_connected=comm_cnt,
                is_in_dense_cluster=is_dense,
                is_involved_in_anomaly=is_anom,
                total_connections=conn_count
            )

            self._node_attention[node_id] = {
                "score": score,
                "priority": priority,
                "factors": factors,
                "is_bridge": bool(b_info is not None),
                "cross_links_count": cross_cnt,
                "communities_connected_count": comm_cnt
            }

    def get_network_graph(self, case_id: str = "CASE-1024") -> NetworkGraphResponse:
        """Returns the full network formatted for Cytoscape.js with Phase 3 community & bridge layers."""
        if not self._computed_metrics:
            self.recompute_analytics()

        bet_map = self._computed_metrics.get("betweenness_centrality", {})
        deg_map = self._computed_metrics.get("degree_centrality", {})
        cl_map = self._computed_metrics.get("closeness_centrality", {})
        pr_map = self._computed_metrics.get("pagerank", {})
        metrics_dict = self._computed_metrics.get("metrics", {
            "totalNodes": len(self._node_attrs),
            "totalEdges": len(self._edge_records),
            "density": 0.0,
            "avgDegree": 0.0,
            "avgBetweenness": 0.0
        })

        nodes: List[CytoscapeNode] = []
        for node_id, data in self._node_attrs.items():
            centrality = float(deg_map.get(node_id, 0.25))
            betweenness = float(bet_map.get(node_id, 0.15))
            closeness = float(cl_map.get(node_id, 0.20))
            pagerank = float(pr_map.get(node_id, 0.01))
            community = self._node_to_community.get(node_id, "Cluster 01")

            attn = self._node_attention.get(node_id, {
                "score": 50,
                "priority": AnalyticalPriority.MEDIUM,
                "is_bridge": False,
                "cross_links_count": 0
            })

            conn_count = self._graph.degree(node_id) if node_id in self._graph else 0

            nodes.append(CytoscapeNode(
                data=CytoscapeNodeData(
                    id=node_id,
                    label=node_id,
                    type=EntityType(data["type"]),
                    community=community,
                    priority=attn["priority"].value if hasattr(attn["priority"], "value") else str(attn["priority"]),
                    attentionScore=attn["score"],
                    centrality=round(centrality, 2),
                    betweenness=round(betweenness, 2),
                    closeness=round(closeness, 2),
                    pagerank=round(pagerank, 3),
                    crossCommunityLinks=attn["cross_links_count"],
                    isBridge=attn["is_bridge"],
                    connectionsCount=conn_count,
                    isFlagged=(attn["priority"] in [AnalyticalPriority.HIGH, AnalyticalPriority.CRITICAL]),
                    metadata=data.get("properties", {})
                )
            ))

        edges: List[CytoscapeEdge] = []
        for e in self._edge_records:
            s_str = str(e["source"])
            t_str = str(e["target"])
            s_comm = self._node_to_community.get(s_str, "Cluster 01")
            t_comm = self._node_to_community.get(t_str, "Cluster 01")
            is_cross = (s_comm != t_comm)

            edges.append(CytoscapeEdge(
                data=CytoscapeEdgeData(
                    id=e["id"],
                    source=s_str,
                    target=t_str,
                    label=e["type"],
                    type=e["type"],
                    confidence=e.get("confidence", 0.90),
                    isAnomaly=e.get("is_anomaly", False),
                    isCrossCommunity=is_cross,
                    sourceCommunity=s_comm,
                    targetCommunity=t_comm,
                    sourceType=e.get("source_type", "INGEST")
                )
            ))

        return NetworkGraphResponse(
            nodes=nodes,
            edges=edges,
            metrics=GraphMetrics(
                totalNodes=metrics_dict.get("totalNodes", len(nodes)),
                totalEdges=metrics_dict.get("totalEdges", len(edges)),
                density=metrics_dict.get("density", 0.0),
                clusterCount=len(self._communities_list) if self._communities_list else 1,
                avgDegree=metrics_dict.get("avgDegree", 0.0),
                avgBetweenness=metrics_dict.get("avgBetweenness", 0.0)
            )
        )

    def get_entity_detail(self, entity_id: str) -> Optional[EntityDetail]:
        """Retrieves comprehensive single entity details with attention breakdown and bridge metrics."""
        if not self._computed_metrics:
            self.recompute_analytics()

        norm_id = entity_id.strip()
        data = self._node_attrs.get(norm_id)
        if not data:
            for k, v in self._node_attrs.items():
                if k.lower() == norm_id.lower():
                    data = v
                    norm_id = k
                    break

        if not data:
            return None

        bet_map = self._computed_metrics.get("betweenness_centrality", {})
        deg_map = self._computed_metrics.get("degree_centrality", {})
        cl_map = self._computed_metrics.get("closeness_centrality", {})
        pr_map = self._computed_metrics.get("pagerank", {})

        betweenness = float(bet_map.get(norm_id, 0.15))
        degree = float(deg_map.get(norm_id, 0.25))
        closeness = float(cl_map.get(norm_id, 0.20))
        pagerank = float(pr_map.get(norm_id, 0.01))

        attn = self._node_attention.get(norm_id, {
            "score": 50,
            "priority": AnalyticalPriority.MEDIUM,
            "factors": [],
            "is_bridge": False,
            "cross_links_count": 0,
            "communities_connected_count": 1
        })

        # Connected neighbors
        neighbors: List[str] = []
        if norm_id in self._graph:
            in_neighbors = list(self._graph.predecessors(norm_id))
            out_neighbors = list(self._graph.successors(norm_id))
            neighbors = list(set(in_neighbors + out_neighbors))

        loc_count = 0
        phone_count = 0
        acct_count = 0
        org_count = 0
        veh_count = 0

        for n in neighbors:
            ntype = self._node_attrs.get(n, {}).get("type", "")
            if ntype == "LOCATION": loc_count += 1
            elif ntype == "PHONE": phone_count += 1
            elif ntype == "ACCOUNT": acct_count += 1
            elif ntype == "ORGANIZATION": org_count += 1
            elif ntype == "VEHICLE": veh_count += 1

        direct_rels = [
            e for e in self._edge_records 
            if e["source"].lower() == norm_id.lower() or e["target"].lower() == norm_id.lower()
        ]

        # Related alerts
        related_alerts = alert_service.get_alerts(case_id="CASE-1024", entity_id=norm_id)

        return EntityDetail(
            id=norm_id,
            label=data["label"],
            type=EntityType(data["type"]),
            community=self._node_to_community.get(norm_id, "Cluster 01"),
            analytical_priority=attn["priority"],
            attention_score=attn["score"],
            degree_centrality=round(degree, 2),
            betweenness_centrality=round(betweenness, 2),
            closeness_centrality=round(closeness, 2),
            pagerank=round(pagerank, 3),
            cross_community_links=attn["cross_links_count"],
            communities_connected_count=attn["communities_connected_count"],
            connections_count=len(neighbors),
            locations_count=loc_count,
            phones_count=phone_count,
            accounts_count=acct_count,
            organizations_count=org_count,
            vehicles_count=veh_count,
            associated_case_ids=["CASE-1024"],
            key_connections=neighbors[:8],
            direct_relationships=direct_rels,
            attention_factors=attn.get("factors", []),
            related_alerts_count=len(related_alerts),
            is_bridge=attn["is_bridge"],
            metadata=data.get("properties", {})
        )

graph_service = GraphService()
