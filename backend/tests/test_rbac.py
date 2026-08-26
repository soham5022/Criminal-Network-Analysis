from fastapi.testclient import TestClient
from app.main import app
from app.core.auth import create_access_token
from app.models.enums import UserRole

client = TestClient(app)

def test_login_endpoint():
    # Successful login
    response = client.post("/api/auth/login", json={
        "email": "rajesh.verma@mha.gov.in",
        "password": "Investigator@2026!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "INVESTIGATOR"

    # Failed login
    bad_res = client.post("/api/auth/login", json={
        "email": "rajesh.verma@mha.gov.in",
        "password": "IncorrectPassword"
    })
    assert bad_res.status_code == 401

def test_rbac_authorization():
    # Create tokens for different roles
    admin_token = create_access_token({"sub": "admin@mha.gov.in", "role": "ADMIN"})
    viewer_token = create_access_token({"sub": "viewer@mha.gov.in", "role": "VIEWER"})

    # Admin accessing audit logs
    admin_res = client.get("/api/audit", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_res.status_code == 200

    # Viewer attempting to create case (forbidden)
    viewer_res = client.post("/api/cases", json={
        "name": "Unauthorized Case Probe",
        "description": "Should fail",
        "priority": "HIGH"
    }, headers={"Authorization": f"Bearer {viewer_token}"})
    assert viewer_res.status_code == 403
