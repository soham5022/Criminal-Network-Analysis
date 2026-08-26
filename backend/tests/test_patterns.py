from app.services.graph_service import graph_service
from app.api.network import populate_synthetic_data
from app.services.pattern_detection_service import pattern_detection_service
from app.models.enums import PatternType

def test_pattern_detection_on_synthetic_graph():
    populate_synthetic_data("CASE-1024", reset=True)
    patterns = graph_service._detected_patterns

    assert len(patterns) >= 3
    pattern_types = [p.pattern_type for p in patterns]

    # Confirm key SIH26189 patterns are detected
    assert (PatternType.CROSS_COMMUNITY_BRIDGE in pattern_types or 
            PatternType.TRANSACTION_ANOMALY in pattern_types or
            PatternType.TEMPORAL_CORRELATION in pattern_types)

    # Check that explanation and evidence exist
    for p in patterns:
        assert len(p.evidence) > 0
        assert len(p.explanation) > 0
        assert 0.0 < p.confidence <= 1.0
