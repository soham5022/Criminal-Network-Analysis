from app.services.nlp_service import nlp_service

def test_extract_structured_entities():
    text = "Person_044 contacted Person_078 near Location_A using Phone_021. Person_078 later transferred funds to Account_103."
    entities = nlp_service.extract_entities_from_text(text)
    
    ids = [e["id"] for e in entities]
    types = [e["type"] for e in entities]

    assert "Person_044" in ids
    assert "Person_078" in ids
    assert "Location_A" in ids
    assert "Phone_021" in ids
    assert "Account_103" in ids
    assert "PERSON" in types
    assert "LOCATION" in types
    assert "PHONE" in types
    assert "ACCOUNT" in types

def test_extract_normalized_short_ids():
    text = "Suspect P001 met at L001 and wired funds to A103."
    entities = nlp_service.extract_entities_from_text(text)
    
    ids = [e["id"] for e in entities]
    assert "Person_001" in ids
    assert "Location_A" in ids
    assert "Account_103" in ids
