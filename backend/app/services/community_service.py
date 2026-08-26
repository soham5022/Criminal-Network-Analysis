import logging
import networkx as nx
from typing import Dict, List, Any, Tuple, Set
from ..models.schemas import CommunityDetail, CrossCommunityLink, BridgeEntity
from ..models.enums import EntityType

logger = logging.getLogger("nexus-intel.community_service")

class CommunityService:
    def detect_communities(
        self, 
        G: nx.Graph, 
        node_attrs: Dict[str, Dict[str, Any]], 
        edge_records: List[Dict[str, Any]],
        centrality_metrics: Dict[str, Any]
    ) -> Tuple[Dict[str, str], List[CommunityDetail], List[CrossCommunityLink], List[BridgeEntity]]:
        """
        Executes community detection and computes:
        1. Node to Community mapping
        2. Detailed community statistics
        3. Cross-community links
        4. Algorithmic bridge entity detection
        """
        if len(G) == 0:
            return {}, [], [], []

        # 1. Real Modularity Community Detection
        communities_raw: List[Set[str]] = []
        try:
            communities_raw = list(nx.community.greedy_modularity_communities(G))
        except Exception as e:
            logger.warning(f"Greedy modularity partition fallback: {e}")
            communities_raw = [set(G.nodes())]

        node_to_comm: Dict[str, str] = {}
        for idx, comm_set in enumerate(communities_raw):
            cluster_name = f"Cluster {idx + 1:02d}"
            for n in comm_set:
                node_to_comm[str(n)] = cluster_name

        baseline_density = float(nx.density(G)) if len(G) > 1 else 0.0
        bet_map = centrality_metrics.get("betweenness_centrality", {})
        deg_map = centrality_metrics.get("degree_centrality", {})

        # 2. Compute Detailed Community Statistics
        community_details: List[CommunityDetail] = []
        for idx, comm_set in enumerate(communities_raw):
            cluster_id = f"Cluster {idx + 1:02d}"
            subgraph = G.subgraph(comm_set)
            
            sub_nodes_count = subgraph.number_of_nodes()
            sub_edges_count = subgraph.number_of_edges()
            internal_density = float(nx.density(subgraph)) if sub_nodes_count > 1 else 0.0

            # Entity Type Distribution
            type_dist: Dict[str, int] = {}
            for n in comm_set:
                ntype = node_attrs.get(str(n), {}).get("type", "PERSON")
                type_dist[ntype] = type_dist.get(ntype, 0) + 1

            # Dominant Relationships in Subgraph
            sub_edge_types: Dict[str, int] = {}
            for e in edge_records:
                if str(e["source"]) in comm_set and str(e["target"]) in comm_set:
                    rtype = e.get("type", "ASSOCIATED_WITH")
                    sub_edge_types[rtype] = sub_edge_types.get(rtype, 0) + 1

            dominant_rels = [
                {"relationship": r, "count": cnt} 
                for r, cnt in sorted(sub_edge_types.items(), key=lambda x: x[1], reverse=True)[:4]
            ]

            # Most central entities in community
            central_nodes = []
            for n in comm_set:
                node_str = str(n)
                central_nodes.append({
                    "id": node_str,
                    "label": node_attrs.get(node_str, {}).get("label", node_str),
                    "type": node_attrs.get(node_str, {}).get("type", "PERSON"),
                    "betweenness": bet_map.get(node_str, 0.0),
                    "degree": deg_map.get(node_str, 0.0)
                })
            central_nodes.sort(key=lambda x: (x["betweenness"], x["degree"]), reverse=True)

            # Density Deviation
            dev_percent = 0.0
            if baseline_density > 0:
                dev_percent = round(((internal_density - baseline_density) / baseline_density) * 100, 1)
            is_dense = (internal_density >= 1.4 * baseline_density and sub_nodes_count >= 5)

            community_details.append(CommunityDetail(
                community_id=cluster_id,
                label=f"{cluster_id} ({sub_nodes_count} entities)",
                size=sub_nodes_count,
                internal_edges_count=sub_edges_count,
                internal_density=round(internal_density, 3),
                entity_type_distribution=type_dist,
                dominant_relationship_types=dominant_rels,
                most_central_entities=central_nodes[:5],
                is_unusually_dense=is_dense,
                density_deviation_percent=dev_percent
            ))

        # 3. Detect Cross-Community Relationships
        cross_links: List[CrossCommunityLink] = []
        for e in edge_records:
            s_str = str(e["source"])
            t_str = str(e["target"])
            s_comm = node_to_comm.get(s_str, "Cluster 01")
            t_comm = node_to_comm.get(t_str, "Cluster 01")

            if s_comm != t_comm:
                cross_links.append(CrossCommunityLink(
                    edge_id=e["id"],
                    source=s_str,
                    target=t_str,
                    source_community=s_comm,
                    target_community=t_comm,
                    relationship_type=e.get("type", "ASSOCIATED_WITH"),
                    timestamp=e.get("timestamp", "2026-08-26T12:00:00"),
                    confidence=float(e.get("confidence", 0.90)),
                    source_centrality=float(deg_map.get(s_str, 0.0)),
                    target_centrality=float(deg_map.get(t_str, 0.0))
                ))

        # 4. Detect Bridge Entities Algorithmically
        # For each node, find all communities its incident edges reach
        node_comm_reach: Dict[str, Set[str]] = {}
        node_cross_count: Dict[str, int] = {}

        for cl in cross_links:
            # Source
            node_comm_reach.setdefault(cl.source, set()).add(cl.target_community)
            node_cross_count[cl.source] = node_cross_count.get(cl.source, 0) + 1
            # Target
            node_comm_reach.setdefault(cl.target, set()).add(cl.source_community)
            node_cross_count[cl.target] = node_cross_count.get(cl.target, 0) + 1

        bridge_entities: List[BridgeEntity] = []
        for node_id, reached_comms in node_comm_reach.items():
            primary_comm = node_to_comm.get(node_id, "Cluster 01")
            all_connected_comms = list(reached_comms | {primary_comm})
            cross_cnt = node_cross_count.get(node_id, 0)
            node_bet = float(bet_map.get(node_id, 0.0))
            node_deg = float(deg_map.get(node_id, 0.0))
            ntype_str = node_attrs.get(node_id, {}).get("type", "PERSON")

            # Condition to qualify as Bridge: connects >= 2 distinct communities with multiple cross-links or high betweenness
            if len(all_connected_comms) >= 2 and (cross_cnt >= 2 or node_bet >= 0.25):
                # Calculate preliminary attention contribution
                attn_score = min(98, int(node_bet * 60 + len(all_connected_comms) * 12 + cross_cnt * 3))
                
                bridge_entities.append(BridgeEntity(
                    entity_id=node_id,
                    entity_type=EntityType(ntype_str) if ntype_str in EntityType.__members__ else EntityType.PERSON,
                    primary_community=primary_comm,
                    communities_connected=sorted(all_connected_comms),
                    communities_connected_count=len(all_connected_comms),
                    cross_community_links_count=cross_cnt,
                    betweenness_centrality=round(node_bet, 3),
                    degree_centrality=round(node_deg, 3),
                    attention_score=attn_score,
                    evidence_snippet=f"Connects {len(all_connected_comms)} communities ({', '.join(all_connected_comms[:3])}) via {cross_cnt} cross-cluster relationships."
                ))

        bridge_entities.sort(key=lambda b: (b.communities_connected_count, b.betweenness_centrality, b.cross_community_links_count), reverse=True)

        return node_to_comm, community_details, cross_links, bridge_entities

community_service = CommunityService()
