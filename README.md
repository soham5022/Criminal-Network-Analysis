# TraceNet — AI-Powered Criminal Network Analysis System

**Smart India Hackathon (SIH) — Prototype Release**  
**Problem Statement ID:** `SIH26189`  
**Title:** AI-Powered Criminal Network Analysis System  
**Tagline:** Connecting the dots in complex investigations.  
**Organization:** Ministry of Home Affairs (MHA)  
**Category:** Software  
**Theme:** Blockchain & Cybersecurity  

---

## 1. Problem & Executive Overview

Law enforcement intelligence units routinely intercept massive, disconnected streams of surveillance data—telecommunication Call Detail Records (CDRs), inter-bank financial ledgers, ANPR vehicle cameras, and textual First Information Reports (FIRs). Manually correlating these multi-modal records across operational syndicates is slow and error-prone.

**TraceNet** solves this challenge by ingesting heterogeneous unstructured and tabular data, running deterministic NLP entity and relationship extraction, building a high-performance knowledge graph (with dual Neo4j Bolt / NetworkX support), and executing graph analytics algorithms (Brandes Betweenness Centrality, Modularity Community Partitioning, Smurfing Velocity Anomaly Detection) to surface explainable intelligence leads with transparent **Analytical Attention Scores (0–100)** without replacing investigator judgment.

```
FRAGMENTED DATA (CDR / Banking / FIRs / ANPR)
       ↓
DATA INGESTION & VALIDATION
       ↓
NLP & RELATIONSHIP EXTRACTION (spaCy + Pattern Normalization)
       ↓
KNOWLEDGE GRAPH (Neo4j Bolt + In-Memory NetworkX Engine)
       ↓
NETWORK INTELLIGENCE (Modularity Partitioning + Betweenness Centrality)
       ↓
6-PATTERN ANOMALY DETECTOR (Bridges, Smurfing, Rapid Bursts, Clusters)
       ↓
EXPLAINABLE ATTENTION SCORE (0-100 & Transparent Factors)
       ↓
ACTIONABLE ALERTS & INVESTIGATOR WORKFLOW (Review, Field Notes, Timeline)
       ↓
EVIDENCE PROVENANCE & PRINTABLE INTELLIGENCE DOSSIER
```

> [!IMPORTANT]
> **Ethical AI & LEA Compliance Disclaimer:**  
> TraceNet provides analytical leads by identifying topological relationships, temporal correlations, and transaction anomalies within available data. Findings are intended solely to assist human investigators in prioritizing review. The system does not determine legal guilt or make automated criminal declarations.


---

## 2. Key Features

- **Multi-Source Data Ingestion**: Automated schema validation and auto-categorization for CDRs, banking transfers, vehicle logs, and FIR transcripts.
- **Dual-Mode Graph Engine**: Native Neo4j Cypher integration with automatic in-memory NetworkX fallback for zero-dependency standalone demonstrations.
- **Graph Analytics & Modularity Partitioning**: Clauset-Newman-Moore community detection partitioning networks into distinct operational cells.
- **Brandes Betweenness Centrality**: Highlights high-value bridge coordinators connecting separate syndicates (`Person_044`).
- **6-Pattern Anomaly Detector**:
  1. `CROSS_COMMUNITY_BRIDGE`: Entities spanning multiple disjoint cells.
  2. `DENSE_NETWORK_CLUSTER`: Sub-networks exhibiting anomalous density ($\ge 1.4\times$ baseline).
  3. `RAPID_RELATIONSHIP_EXPANSION`: Sudden acceleration of new counterparties within short windows.
  4. `TRANSACTION_ANOMALY`: Smurfing patterns (repeated structured payments below regulatory thresholds).
  5. `TEMPORAL_CORRELATION`: Multi-modal sequence convergence (`Call` $\to$ `Location Visit` $\to$ `Transfer`).
  6. `HIGH_BETWEENNESS_ENTITY`: Structural gatekeepers in the 90th percentile of shortest paths.
- **Explainable Analytical Attention Score (0–100)**: Deterministic, normalized scoring with explicit point factor breakdowns (+30 Betweenness, +25 Cross-Community, +15 Degree, +15 Anomaly, +10 Dense Cluster).
- **8-Tab Unified Case Workspace**: Overview, Interactive Network (Cytoscape.js), Entities Directory, Timeline Stream, Alerts Queue, Evidence Ledger, Printable Dossier, and Investigator Notes.
- **Evidence Provenance Ledger**: Every relationship links back to its raw source record (`CDR_00441`, `SWIFT_T882`, etc.) with verifiable SHA-256 cryptographic hashes.
- **Enterprise Security & Audit**: JWT tokens signed with HMAC-SHA256, bcrypt password hashing, Role-Based Access Control (`ADMIN`, `INVESTIGATOR`, `VIEWER`), and an immutable, searchable compliance audit trail.
- **Presentation & Demo Mode**: One-click **Reset Demo Case** to restore `CASE-1024 (Operation Meridian)` to its pristine baseline, and a fullscreen **Presentation Mode** for judge evaluations.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | React 19, TypeScript, Tailwind CSS 3, Cytoscape.js (Force-directed graph layout), Lucide Icons, Vite |
| **Backend API** | FastAPI (Python 3.11+), Pydantic v2, Uvicorn, AnyIO |
| **Graph Intelligence** | NetworkX 3.3, Neo4j Python Driver 5.23 (Cypher Query Language) |
| **NLP & Extraction** | spaCy, Regular Expression Normalizers, Deterministic Entity Extractors |
| **Security & Auth** | PyJWT (HMAC-SHA256), Bcrypt password hashing |
| **Data & Telemetry** | Pandas, SHA-256 Record Hasher, In-Memory Audit Repository |

---

## 4. Seeded Demonstration Credentials

| Role | Name | Email | Password | Badge Number |
|---|---|---|---|---|
| **INVESTIGATOR** | Inspector Rajesh Verma | `rajesh.verma@mha.gov.in` | `Investigator@2026!` | `MHA-INT-8902` |
| **ADMIN** | Director K. S. Menon | `admin@mha.gov.in` | `Admin@MHA2026!` | `MHA-DIR-001` |
| **VIEWER** | Analyst Priya Nair | `viewer@mha.gov.in` | `Viewer@2026!` | `MHA-ANA-4011` |

*The sign-in modal features 1-click test role shortcut buttons for seamless demonstration.*

---

## 5. Quick Start & Installation

### Step 1: Clone and Setup Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Backend runs at `http://127.0.0.1:8000/` (Interactive Swagger Docs: `http://127.0.0.1:8000/docs`).*

### Step 2: Setup Frontend
```bash
npm install
npm run dev
```
*Frontend runs at `http://127.0.0.1:5173/`.*

### Step 3: Run Automated Test Suite
```bash
cd backend
.\venv\Scripts\pytest -v
```
*All 29 test suites for auth, RBAC, community detection, pattern detection, case management, and audit logging will execute with 100% pass rate.*

---

## 6. 5-Minute SIH Demonstration Sequence

Use this exact timed script during judge evaluations:

| Time | Action | What to Show | What to Say | Expected Result |
|---|---|---|---|---|
| **0:00 — Problem** | Open `http://127.0.0.1:5173/` | Overview Dashboard & Live Health Badges (`API: Online`, `Engine: Ready`) | "Welcome. NEXUS INTEL addresses SIH26189 by replacing manual investigation correlation with explainable graph intelligence across multi-modal records." | Dashboard loads with live network KPI metrics and health telemetry. |
| **0:30 — Case Intro** | Click **Cases** $\to$ Select **CASE-1024 (Operation Meridian)** | Case Workspace & Status Badges | "Here is Operation Meridian, an active cross-border trafficking and hawala case. Let's inspect our baseline data." | 8-tab case workspace opens with investigator telemetry. |
| **1:00 — Ingestion** | Click **Ingest Case Data** $\to$ Select CDR/Banking dataset $\to$ Click **Run Analysis** | Ingestion Modal & Live Pipeline Telemetry | "We ingest raw multi-source CSV files. The pipeline validates schemas, extracts normalized entities and relationships, and builds the knowledge graph in real-time." | Telemetry displays processed records, extracted entities, relationships, execution time (1.18s). |
| **1:30 — Graph View** | Click **Network** tab $\to$ Toggle **Community View** | Cytoscape Force-Directed Graph with colored clusters | "Our graph partitions the syndicate into 4 distinct modularity communities representing operational cells." | Graph renders with distinct cluster hues. |
| **2:00 — Bridge Discovery** | Toggle **Bridge View** in graph controls $\to$ Click on `Person_044` | Node highlighted across clusters $\to$ Entity Intelligence Panel opens | "Notice Person_044. The system flags this node with an Analytical Attention Score of 82/100 as a key bridge linking three separate clusters." | Entity panel displays degree (23), betweenness (0.61), 7 cross-community links, and factor point breakdown. |
| **2:45 — Explainable Alert** | Open **Alerts** tab $\to$ Click `ALT-9041 (Cross-Community Bridge)` | Alert Dossier, Evidence List, and Methodology | "Every alert answers: What happened, why was it detected, what evidence supports it, and what should the investigator do next." | Alert displays full explainability breakdown and "Investigate in Network" button. |
| **3:30 — Notes & Workflow** | In alert, change status to `INVESTIGATING` $\to$ Open **Notes & Activity** $\to$ Add note | Updated status badge and persistent field note stream | "Investigators can triage alerts and log case observations linked to specific suspect entities with badge numbers." | Note is recorded and timestamped with Inspector Verma's badge number. |
| **4:00 — Evidence & Timeline** | Open **Evidence** tab $\to$ Open **Timeline** tab | Evidence provenance table with SHA-256 hashes $\to$ Chronological multi-source event stream | "Every finding links to raw source records with SHA-256 cryptographic hashes. The timeline confirms a Call followed by Location Visit and Swift Transfer within 8 hours." | Evidence hashes and chronological multi-modal events displayed. |
| **4:30 — Dossier & Audit** | Open **Reports** $\to$ Generate Report $\to$ Switch to Director Menon $\to$ Open **Audit Trail** | Printable Intelligence Report $\to$ Read-only compliance audit log | "We generate formal intelligence dossiers with ethical AI disclaimers, while our immutable audit trail records all queries and actions for court compliance." | Formal dossier renders and audit trail confirms all actions logged. |
| **5:00 — Conclusion** | Toggle **Presentation Mode** $\to$ Reset Demo Case | Fullscreen clean view $\to$ Instant baseline restore | "NEXUS INTEL provides explainable, reproducible, and compliant network intelligence for law enforcement. Thank you." | Case is restored to clean baseline state for the next review. |

---

## 7. Technical Reference & Architecture

### Backend API Routes
- **Authentication**: `POST /api/auth/login`, `GET /api/auth/me`
- **Case Management**: `GET /api/cases`, `POST /api/cases`, `GET /api/cases/{id}`, `POST /api/cases/{id}/reset`, `GET /api/cases/{id}/evidence`
- **Graph & Network**: `GET /api/network/{case_id}`, `POST /api/network/{case_id}/recompute`
- **Entity Intelligence**: `GET /api/entities`, `GET /api/entities/{id}`, `GET /api/entities/{id}/connections`
- **Analytics & Patterns**: `GET /api/analytics/network-summary`, `GET /api/analytics/communities`, `GET /api/analytics/bridges`, `GET /api/analytics/patterns`
- **Alerts & Timeline**: `GET /api/alerts`, `PATCH /api/alerts/{id}/status`, `GET /api/timeline`
- **Investigator Notes**: `GET /api/cases/{id}/notes`, `POST /api/cases/{id}/notes`
- **Security Audit & Health**: `GET /api/audit`, `GET /api/health`, `GET /api/health/neo4j`, `GET /api/health/system`

### Graph Model
- **Node Labels**: `Person`, `Phone`, `Account`, `Location`, `Organization`, `Vehicle`
- **Relationship Types**: `CALLED`, `TRANSFERRED`, `VISITED`, `ASSOCIATED_WITH`, `OWNS_DEVICE`, `TRAVELS_IN`
- **Edge Properties**: `confidence`, `timestamp`, `source_type`, `amount`, `duration`, `is_anomaly`, `source_record`

---

## 8. Limitations & Future Scope

- **Neo4j Production Scaling**: The current release supports dual-mode execution (local Neo4j Bolt or in-memory NetworkX). For multi-million entity graphs, dedicated Neo4j Enterprise clusters with GDS (Graph Data Science) library are recommended.
- **Multilingual Transcripts**: Current NLP extractors are tuned for English FIR transcripts. Future iterations will incorporate Indic-BERT for regional Indian languages.
- **Distributed Ingestion**: Large historical CDR dumps (>100GB) can be scaled via Apache Kafka + Apache Spark streaming workers.
