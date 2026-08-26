import networkx as nx
from typing import Dict, Any, List

class GraphAnalysisService:
    @staticmethod
    def compute_metrics(G: nx.Graph) -> Dict[str, Any]:
        """Calculates degree, betweenness, and community partitions using NetworkX."""
        if len(G) == 0:
            return {
                "degree_centrality": {},
                "betweenness_centrality": {},
                "communities": {},
                "metrics": {
                    "totalNodes": 0,
                    "totalEdges": 0,
                    "density": 0.0,
                    "clusterCount": 0,
                    "avgDegree": 0.0
                }
            }

        # Centrality metrics
        deg_centrality = nx.degree_centrality(G)
        
        # Approximate betweenness if graph is large for fast interactive response
        k_samples = min(50, len(G)) if len(G) > 200 else None
        bet_centrality = nx.betweenness_centrality(G, k=k_samples, normalized=True)

        # Community detection
        communities_map: Dict[str, str] = {}
        try:
            communities = list(nx.community.greedy_modularity_communities(G))
            for idx, comm in enumerate(communities):
                cluster_label = f"Cluster {idx + 1:02d}"
                for node in comm:
                    communities_map[str(node)] = cluster_label
        except Exception:
            for node in G.nodes():
                communities_map[str(node)] = "Cluster 01"

        cluster_count = len(set(communities_map.values()))
        total_nodes = G.number_of_nodes()
        total_edges = G.number_of_edges()
        density = nx.density(G)
        avg_degree = (2.0 * total_edges / total_nodes) if total_nodes > 0 else 0.0

        return {
            "degree_centrality": deg_centrality,
            "betweenness_centrality": bet_centrality,
            "communities": communities_map,
            "metrics": {
                "totalNodes": total_nodes,
                "totalEdges": total_edges,
                "density": round(float(density), 3),
                "clusterCount": cluster_count,
                "avgDegree": round(float(avg_degree), 2)
            }
        }

analysis_service = GraphAnalysisService()
