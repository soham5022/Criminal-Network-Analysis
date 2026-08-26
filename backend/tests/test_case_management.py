from fastapi.testclient import TestClient
from app.main import app
from app.core.auth import create_access_token
from app.services.audit_service import audit_service
from app.models.enums import AuditAction, UserRole

client = TestClient(app)
investigator_token = create_access_token({"sub": "rajesh.verma@mha.gov.in", "role": "INVESTIGATOR"})

def test_case_creation_and_notes():
    # 1. Create a new case
    case_res = client.post("/api/cases", json={
        "name": "Operation BlueHawk",
        "description": "Inter-state logistics anomaly investigation.",
        "priority": "HIGH",
        "lead_investigator": "Inspector Rajesh Verma"
    }, headers={"Authorization": f"Bearer {investigator_token}"})
    
    assert case_res.status_code == 200
    created_case = case_res.json()
    case_id = created_case["id"]
    assert "CASE-" in case_id
    assert created_case["name"] == "Operation BlueHawk"

    # 2. Add an investigator note
    note_res = client.post(f"/api/cases/{case_id}/notes", json={
        "content": "Initial surveillance intercepts confirm active communications.",
        "entity_id": "Person_044"
    }, headers={"Authorization": f"Bearer {investigator_token}"})
    assert note_res.status_code == 200
    note_data = note_res.json()
    assert note_data["case_id"] == case_id
    assert "NOTE-" in note_data["id"]

    # 3. Retrieve notes
    get_notes = client.get(f"/api/cases/{case_id}/notes", headers={"Authorization": f"Bearer {investigator_token}"})
    assert get_notes.status_code == 200
    notes_list = get_notes.json()
    assert len(notes_list) >= 1

def test_demo_reset_and_evidence():
    # Test Demo Reset endpoint
    reset_res = client.post("/api/cases/CASE-1024/reset", headers={"Authorization": f"Bearer {investigator_token}"})
    assert reset_res.status_code == 200
    reset_data = reset_res.json()
    assert reset_data["status"] == "RESET_SUCCESSFUL"
    assert reset_data["entities_count"] > 0

    # Test Evidence Provenance endpoint
    evidence_res = client.get("/api/cases/CASE-1024/evidence", headers={"Authorization": f"Bearer {investigator_token}"})
    assert evidence_res.status_code == 200
    evidence = evidence_res.json()
    assert len(evidence) > 0
    assert "sha256:" in evidence[0]["sha256_hash"]

def test_health_endpoints():
    health_res = client.get("/api/health")
    assert health_res.status_code == 200
    assert health_res.json()["status"] == "healthy"

    sys_health = client.get("/api/health/system")
    assert sys_health.status_code == 200
    assert sys_health.json()["api_status"] == "ONLINE"
