from app.services.graph_service import graph_service
from app.models.enums import EntityType, RelationshipType

def test_graph_node_and_relationship_creation():
    graph_service.clear("TEST_CASE")
    
    graph_service.add_node("Person_001", "Person_001", EntityType.PERSON)
    graph_service.add_node("Person_044", "Person_044", EntityType.PERSON)
    graph_service.add_node("Account_103", "Account_103", EntityType.ACCOUNT)
    
    graph_service.add_relationship("Person_001", "Person_044", RelationshipType.CALLED)
    graph_service.add_relationship("Person_044", "Account_103", RelationshipType.TRANSFERRED)
    
    graph = graph_service.get_network_graph("TEST_CASE")
    assert len(graph.nodes) == 3
    assert len(graph.edges) == 2
    assert graph.metrics.totalNodes == 3
    assert graph.metrics.totalEdges == 2

def test_entity_detail_retrieval():
    graph_service.clear("TEST_CASE")
    graph_service.add_node("Person_044", "Person_044", EntityType.PERSON)
    graph_service.add_node("Person_078", "Person_078", EntityType.PERSON)
    graph_service.add_relationship("Person_044", "Person_078", RelationshipType.MET)
    
    detail = graph_service.get_entity_detail("Person_044")
    assert detail is not None
    assert detail.id == "Person_044"
    assert "Person_078" in detail.key_connections
    assert detail.connections_count == 1
