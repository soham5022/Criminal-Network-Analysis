import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["system"] == "NEXUS INTEL"
    assert data["problem_statement"] == "SIH26189"

def test_cases_endpoints():
    res = client.get("/api/cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) >= 1
    assert cases[0]["id"] == "CASE-1024"

    res_single = client.get("/api/cases/CASE-1024")
    assert res_single.status_code == 200
    assert res_single.json()["name"] == "Operation Meridian"

def test_network_and_entities_endpoints():
    # Build or fetch network
    res = client.get("/api/network/CASE-1024")
    assert res.status_code == 200
    graph = res.json()
    assert "nodes" in graph
    assert "edges" in graph
    assert "metrics" in graph

    # Fetch entities list
    res_ent = client.get("/api/entities")
    assert res_ent.status_code == 200
    assert len(res_ent.json()) > 0

    # Fetch specific entity Person_044
    res_single = client.get("/api/entities/Person_044")
    assert res_single.status_code == 200
    ent_data = res_single.json()
    assert ent_data["id"] == "Person_044"
    assert "degree_centrality" in ent_data
    assert "betweenness_centrality" in ent_data

def test_csv_upload_endpoint():
    csv_content = "person_id,name\nP998,Person_998\nP999,Person_999\n"
    files = {"file": ("test_people.csv", csv_content.encode("utf-8"), "text/csv")}
    res = client.post("/api/uploads", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["records_valid"] == 2
