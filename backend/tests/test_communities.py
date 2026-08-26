import networkx as nx
from app.services.community_service import community_service
from app.services.graph_analysis_service import graph_analysis_service

def test_community_detection():
    G = nx.Graph()
    # Create two connected cliques: Clique 1 (1-5), Clique 2 (6-10) with bridge edge (5-6)
    for i in range(1, 6):
        for j in range(i + 1, 6):
            G.add_edge(str(i), str(j))

    for i in range(6, 11):
        for j in range(i + 1, 11):
            G.add_edge(str(i), str(j))

    G.add_edge("5", "6")

    node_attrs = {str(i): {"type": "PERSON", "label": f"P{i}"} for i in range(1, 11)}
    edge_records = [{"id": f"e_{u}_{v}", "source": u, "target": v, "type": "CALLED"} for u, v in G.edges()]

    metrics = graph_analysis_service.compute_all_metrics(G)
    node_to_comm, comm_details, cross_links, bridges = community_service.detect_communities(
        G, node_attrs, edge_records, metrics
    )

    assert len(comm_details) >= 2
    assert len(cross_links) >= 1
    assert any(cl.source == "5" or cl.target == "5" for cl in cross_links)
