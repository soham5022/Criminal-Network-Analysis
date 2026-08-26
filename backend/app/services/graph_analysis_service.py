import logging
import networkx as nx
from typing import Dict, Any, List

logger = logging.getLogger("nexus-intel.graph_analysis_service")

class GraphAnalysisService:
    def compute_all_metrics(self, G: nx.Graph) -> Dict[str, Any]:
        """Calculates degree, betweenness, closeness, PageRank, and network-wide baseline topology."""
        if len(G) == 0:
            return {
                "degree_centrality": {},
                "betweenness_centrality": {},
                "closeness_centrality": {},
                "pagerank": {},
                "metrics": {
                    "totalNodes": 0,
                    "totalEdges": 0,
                    "density": 0.0,
                    "clusterCount": 0,
                    "avgDegree": 0.0,
                    "avgBetweenness": 0.0
                }
            }

        # 1. Degree Centrality (normalized 0.0 to 1.0)
        deg_centrality = nx.degree_centrality(G)

        # 2. Betweenness Centrality (normalized 0.0 to 1.0)
        k_samples = min(80, len(G)) if len(G) > 200 else None
        bet_centrality = nx.betweenness_centrality(G, k=k_samples, normalized=True)

        # 3. Closeness Centrality
        try:
            close_centrality = nx.closeness_centrality(G)
        except Exception:
            close_centrality = {n: 0.1 for n in G.nodes()}

        # 4. PageRank
        try:
            pr = nx.pagerank(G, alpha=0.85, max_iter=100)
        except Exception:
            pr = {n: 1.0 / len(G) for n in G.nodes()}

        total_nodes = G.number_of_nodes()
        total_edges = G.number_of_edges()
        density = float(nx.density(G))
        avg_degree = (2.0 * total_edges / total_nodes) if total_nodes > 0 else 0.0
        avg_betweenness = sum(bet_centrality.values()) / max(1, len(bet_centrality))

        return {
            "degree_centrality": {k: round(float(v), 4) for k, v in deg_centrality.items()},
            "betweenness_centrality": {k: round(float(v), 4) for k, v in bet_centrality.items()},
            "closeness_centrality": {k: round(float(v), 4) for k, v in close_centrality.items()},
            "pagerank": {k: round(float(v), 4) for k, v in pr.items()},
            "metrics": {
                "totalNodes": total_nodes,
                "totalEdges": total_edges,
                "density": round(density, 4),
                "avgDegree": round(float(avg_degree), 2),
                "avgBetweenness": round(float(avg_betweenness), 4)
            }
        }

graph_analysis_service = GraphAnalysisService()
