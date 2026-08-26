import hashlib
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from ..models.schemas import CaseSchema, CaseCreateRequest, EvidenceRecordSchema, UserSchema
from ..models.enums import CaseStatus, CasePriority, AuditAction, UserRole
from ..services.graph_service import graph_service
from ..services.audit_service import audit_service
from ..core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/cases", tags=["Investigation Cases"])

# Synthetic Case Dossiers
MOCK_CASES = [
    {
        "id": "CASE-1024",
        "name": "Operation Meridian",
        "code_name": "MERIDIAN_ALPHA",
        "status": CaseStatus.ACTIVE,
        "priority": CasePriority.CRITICAL,
        "lead_investigator": "Inspector Rajesh Verma",
        "badge_number": "MHA-INT-8902",
        "department": "Special Cyber & Financial Crimes Division",
        "date_opened": "2026-06-10",
        "last_activity": "Just now (Live Graph Synced)",
        "entity_count": 91,
        "relationship_count": 284,
        "flagged_alerts_count": 6,
        "clusters_identified": 4,
        "tags": ["Financial Smurfing", "Multi-Cluster Bridge", "Cross-Border Shells", "Encrypted CDR"],
        "description": "Multi-jurisdictional intelligence probe analyzing coordinated financial structuring and physical transshipment anomalies linked to synthetic enterprise accounts.",
        "objective": "Map the complete hierarchy connecting shell account Account_103 with transport hubs (Location_A) and pinpoint bridge coordinators between Cluster 01 and Cluster 03.",
        "key_findings": [
            "Person_044 identified as primary multi-cluster bridge (betweenness centrality: 0.61).",
            "Account_103 disbursed ₹48,000 sub-threshold transfers within 22 minutes of deposit.",
            "Physical rendezvous verified via CCTV at Location_A between Person_044 and Person_078.",
            "Organization_X acts as front aggregator holding lease contracts on transshipment hubs."
        ],
        "evidence_pointers": {
            "fir_count": 6,
            "cdr_logs_count": 2410,
            "bank_transactions_count": 1820,
            "incident_reports_count": 14
        }
    },
    {
        "id": "CASE-1031",
        "name": "Project Shadowline",
        "code_name": "SHADOWLINE_SEC",
        "status": CaseStatus.ACTIVE,
        "priority": CasePriority.HIGH,
        "lead_investigator": "Deputy Director Neha Sengupta",
        "badge_number": "MHA-INT-4411",
        "department": "Cyber Forensics & Counter-Infiltration Cell",
        "date_opened": "2026-07-02",
        "last_activity": "2 hours ago",
        "entity_count": 36,
        "relationship_count": 118,
        "flagged_alerts_count": 7,
        "clusters_identified": 3,
        "tags": ["Burner SIM Network", "Cell Tower Triangulation", "Encrypted VOIP"],
        "description": "Investigation into coordinated short-burst communication rings using dynamic IMEI rotation across northern metropolitan corridors.",
        "objective": "Trace hardware signatures and identify common procurement channels for burner SIM clusters.",
        "key_findings": [
            "High temporal correlation between Phone_021 and four rotating burner SIMs.",
            "Geographic overlap detected near Terminal 2 logistics perimeter."
        ],
        "evidence_pointers": {
            "fir_count": 3,
            "cdr_logs_count": 4200,
            "bank_transactions_count": 310,
            "incident_reports_count": 8
        }
    },
    {
        "id": "CASE-1042",
        "name": "Operation Northstar",
        "code_name": "NORTHSTAR_GRID",
        "status": CaseStatus.UNDER_REVIEW,
        "priority": CasePriority.MEDIUM,
        "lead_investigator": "ACP Vikramaditya Roy",
        "badge_number": "MHA-INT-7104",
        "department": "Inter-State Crime Intelligence Bureau",
        "date_opened": "2026-07-15",
        "last_activity": "1 day ago",
        "entity_count": 29,
        "relationship_count": 82,
        "flagged_alerts_count": 5,
        "clusters_identified": 2,
        "tags": ["Automated ANPR Track", "Fleet Route Anomalies"],
        "description": "Surveillance analysis focused on vehicle fleet movements between transit checkpoints and unlisted private logistics yards.",
        "objective": "Correlate ANPR timestamp logs with telecommunication tower co-locations.",
        "key_findings": [
            "Vehicle_017 logged recurring nocturnal route patterns along State Highway 4."
        ],
        "evidence_pointers": {
            "fir_count": 4,
            "cdr_logs_count": 1150,
            "bank_transactions_count": 420,
            "incident_reports_count": 19
        }
    }
]

_case_counter = 1050

@router.get("", response_model=List[CaseSchema])
async def list_cases():
    # Dynamically update CASE-1024 stats from live graph
    for c in MOCK_CASES:
        if c["id"] == "CASE-1024":
            c["entity_count"] = max(len(graph_service._node_attrs), 48)
            c["relationship_count"] = max(len(graph_service._edge_records), 164)
            c["clusters_identified"] = max(len(graph_service._detected_communities), 4)
            c["patterns_detected_count"] = len(graph_service._detected_patterns)
    return MOCK_CASES

@router.get("/{case_id}", response_model=CaseSchema)
async def get_case_by_id(case_id: str):
    case = next((c for c in MOCK_CASES if c["id"].lower() == case_id.lower()), None)
    if not case:
        raise HTTPException(status_code=404, detail=f"Case with ID {case_id} not found")
    
    if case["id"] == "CASE-1024":
        case["entity_count"] = max(len(graph_service._node_attrs), 48)
        case["relationship_count"] = max(len(graph_service._edge_records), 164)
        case["clusters_identified"] = max(len(graph_service._detected_communities), 4)
        case["patterns_detected_count"] = len(graph_service._detected_patterns)

    return case

@router.post("", response_model=CaseSchema)
async def create_case(
    case_req: CaseCreateRequest,
    current_user: UserSchema = Depends(require_role([UserRole.INVESTIGATOR, UserRole.ADMIN]))
):
    global _case_counter
    _case_counter += 1
    new_id = f"CASE-{_case_counter}"
    code_name = f"{case_req.name.upper().replace(' ', '_')}_SEC"

    new_case = {
        "id": new_id,
        "name": case_req.name,
        "code_name": code_name,
        "status": CaseStatus.ACTIVE,
        "priority": case_req.priority,
        "lead_investigator": case_req.lead_investigator or current_user.name,
        "badge_number": current_user.badge_number,
        "department": current_user.department,
        "date_opened": "2026-08-26",
        "last_activity": "Just created",
        "entity_count": 0,
        "relationship_count": 0,
        "flagged_alerts_count": 0,
        "clusters_identified": 0,
        "patterns_detected_count": 0,
        "tags": case_req.tags,
        "description": case_req.description,
        "objective": f"Investigate structured network anomalies and intelligence leads for {case_req.name}.",
        "key_findings": ["Case initialized in NEXUS INTEL. Awaiting initial dataset ingestion."],
        "evidence_pointers": {
            "fir_count": 1,
            "cdr_logs_count": 0,
            "bank_transactions_count": 0,
            "incident_reports_count": 0
        }
    }
    MOCK_CASES.insert(0, new_case)

    # Audit log
    audit_service.log_action(
        user_email=current_user.email,
        user_name=current_user.name,
        user_role=current_user.role,
        action=AuditAction.CASE_CREATED,
        case_id=new_id,
        details=f"Case '{case_req.name}' created by {current_user.name}."
    )

    return new_case

@router.post("/{case_id}/reset")
async def reset_demo_case(
    case_id: str,
    current_user: UserSchema = Depends(require_role([UserRole.INVESTIGATOR, UserRole.ADMIN]))
):
    """
    Restores the synthetic demonstration case (CASE-1024) to known baseline.
    """
    from ..api.network import populate_synthetic_data
    populate_synthetic_data(case_id=case_id, reset=True)

    audit_service.log_action(
        user_email=current_user.email,
        user_name=current_user.name,
        user_role=current_user.role,
        action=AuditAction.DEMO_RESET,
        case_id=case_id,
        details=f"Demo environment reset to baseline for {case_id} by {current_user.name}."
    )

    return {
        "status": "RESET_SUCCESSFUL",
        "case_id": case_id,
        "entities_count": len(graph_service._node_attrs),
        "relationships_count": len(graph_service._edge_records),
        "communities_count": len(graph_service._detected_communities),
        "patterns_count": len(graph_service._detected_patterns),
        "message": f"Case {case_id} graph and analytics successfully restored to baseline."
    }

@router.get("/{case_id}/evidence", response_model=List[EvidenceRecordSchema])
async def get_case_evidence(
    case_id: str,
    current_user: UserSchema = Depends(get_current_user)
):
    """
    Returns verifiable synthetic raw data records and SHA-256 provenance hashes.
    """
    evidence_list = []
    for edge in graph_service._edge_records[:40]:
        src = edge.get("source", "")
        tgt = edge.get("target", "")
        rel = edge.get("type", "ASSOCIATED")
        ts = edge.get("timestamp", "2026-08-26T10:00:00Z")
        src_rec = edge.get("sourceRecord", f"REC_{src}_{tgt}")
        
        raw_str = f"{src_rec}|{src}|{rel}|{tgt}|{ts}"
        sha = hashlib.sha256(raw_str.encode("utf-8")).hexdigest()[:16]

        evidence_list.append(EvidenceRecordSchema(
            record_id=src_rec,
            case_id=case_id,
            source_dataset="Synthetic Demonstration Store",
            record_type=rel,
            timestamp=ts,
            primary_entity=src,
            counterparty_entity=tgt,
            summary=f"{src} ─[{rel}]─▶ {tgt} verified in {src_rec}",
            confidence=float(edge.get("confidence", 0.92)),
            sha256_hash=f"sha256:{sha}"
        ))

    return evidence_list
