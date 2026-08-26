from app.services.attention_scoring_service import attention_scoring_service
from app.models.enums import AnalyticalPriority

def test_attention_score_bounds_and_factors():
    score, priority, factors = attention_scoring_service.calculate_score(
        node_id="Person_044",
        betweenness=0.61,
        degree=0.72,
        cross_community_links=7,
        communities_connected=3,
        is_in_dense_cluster=True,
        is_involved_in_anomaly=True,
        total_connections=23
    )

    assert 0 <= score <= 100
    assert score >= 75
    assert priority == AnalyticalPriority.CRITICAL
    assert len(factors) >= 4
    
    factor_names = [f.name for f in factors]
    assert "Betweenness Centrality" in factor_names
    assert "Cross-Community Connections" in factor_names

def test_low_attention_score():
    score, priority, factors = attention_scoring_service.calculate_score(
        node_id="Person_499",
        betweenness=0.01,
        degree=0.02,
        cross_community_links=0,
        communities_connected=1,
        is_in_dense_cluster=False,
        is_involved_in_anomaly=False,
        total_connections=1
    )

    assert score <= 35
    assert priority == AnalyticalPriority.LOW
