from app.services.relationship_service import relationship_service, normalize_entity_id
from app.models.enums import RelationshipType

def test_normalize_entity_id():
    assert normalize_entity_id("P044") == "Person_044"
    assert normalize_entity_id("L001") == "Location_A"
    assert normalize_entity_id("A103") == "Account_103"
    assert normalize_entity_id("Person_078") == "Person_078"

def test_map_call_record():
    record = {"call_id": "C101", "caller": "P001", "receiver": "P044", "timestamp": "2026-08-10T10:30:00"}
    rel = relationship_service.map_call_record(record)
    assert rel["source"] == "Person_001"
    assert rel["target"] == "Person_044"
    assert rel["type"] == RelationshipType.CALLED
    assert rel["confidence"] >= 0.90

def test_map_transaction_smurfing():
    # Between 45k and 50k should trigger smurfing anomaly flag
    record = {"transaction_id": "T88", "from_account": "A103", "to_account": "A221", "amount": 48000, "timestamp": "2026-08-10T14:32:00"}
    rel = relationship_service.map_transaction_record(record)
    assert rel["source"] == "Account_103"
    assert rel["target"] == "Account_221"
    assert rel["type"] == RelationshipType.TRANSFERRED
    assert rel["properties"]["flagged_anomaly"] is True

def test_text_relationship_extraction():
    text = "Person_044 called Person_078."
    entities = [{"id": "Person_044", "label": "Person_044"}, {"id": "Person_078", "label": "Person_078"}]
    rels = relationship_service.extract_relationships_from_text(text, entities)
    assert len(rels) == 1
    assert rels[0]["source"] == "Person_044"
    assert rels[0]["target"] == "Person_078"
    assert rels[0]["type"] == RelationshipType.CALLED
