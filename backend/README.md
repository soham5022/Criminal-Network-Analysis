# NEXUS INTEL — Backend & Data Intelligence Pipeline (SIH26189)

AI-Powered Criminal Network Analysis System prototype backend for the Ministry of Home Affairs (SIH26189).

---

## 🏗️ Architecture

```
FastAPI REST API
       │
       ├── /api/uploads  ──> Data Validation Engine (pandas/Pydantic)
       ├── /api/network  ──> Graph Extraction & Cytoscape Payload
       ├── /api/entities ──> Centrality & Neighborhood Intelligence
       ├── /api/cases    ──> Investigation Case Dossiers
       └── /api/alerts   ──> Anomaly Pattern Flags
       │
       ├── NLP Service (spaCy + Deterministic Entity Recognizer)
       ├── Relationship Extraction Engine
       └── Graph Service
             ├── Neo4j Driver (bolt://localhost:7687)
             └── NetworkX In-Memory Analytics (Modularity & Centrality)
```

---

## 🚀 Setup & Execution

### 1. Create Virtual Environment and Install Dependencies
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Generate Synthetic Benchmark Datasets
```bash
python data/synthetic/generator.py
```

### 3. (Optional) Configure Neo4j Connection
Copy `.env.example` to `.env` and set your credentials:
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password
NEO4J_DATABASE=neo4j
```
*Note:* If Neo4j is not running locally, the backend automatically uses the built-in NetworkX graph engine so you can evaluate all features out-of-the-box.

### 4. Launch FastAPI Dev Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Interactive OpenAPI documentation will be accessible at: **http://127.0.0.1:8000/docs**

### 5. Run Automated Test Suite
```bash
pytest
```
