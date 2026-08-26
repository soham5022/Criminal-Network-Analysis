from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from .enums import (
    EntityType, 
    RelationshipType, 
    AnalyticalPriority, 
    CaseStatus, 
    CasePriority, 
    PatternType,
    AlertSeverity, 
    AlertStatus,
    UserRole,
    AuditAction
)

class EntityBase(BaseModel):
    id: str
    label: str
    type: EntityType
    community: str = "Cluster 01"
    analytical_priority: AnalyticalPriority = AnalyticalPriority.MEDIUM
    attention_score: int = 50
    degree_centrality: float = 0.0
    betweenness_centrality: float = 0.0
    closeness_centrality: float = 0.0
    pagerank: float = 0.0
    cross_community_links: int = 0
    communities_connected_count: int = 1
    connections_count: int = 0
    locations_count: int = 0
    phones_count: int = 0
    accounts_count: int = 0
    organizations_count: int = 0
    vehicles_count: int = 0
    last_activity: str = "Recently active"
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AttentionScoreFactor(BaseModel):
    name: str
    points: int
    reason: str

class EntityDetail(EntityBase):
    associated_case_ids: List[str] = Field(default_factory=list)
    key_connections: List[str] = Field(default_factory=list)
    direct_relationships: List[Dict[str, Any]] = Field(default_factory=list)
    attention_factors: List[AttentionScoreFactor] = Field(default_factory=list)
    related_alerts_count: int = 0
    is_bridge: bool = False

class CytoscapeNodeData(BaseModel):
    id: str
    label: str
    type: EntityType
    community: str
    priority: str
    attentionScore: int = 50
    centrality: float
    betweenness: float
    closeness: float = 0.0
    pagerank: float = 0.0
    crossCommunityLinks: int = 0
    isBridge: bool = False
    connectionsCount: int
    isFlagged: bool = False
    metadata: Optional[Dict[str, Any]] = None

class CytoscapeNode(BaseModel):
    data: CytoscapeNodeData

class CytoscapeEdgeData(BaseModel):
    id: str
    source: str
    target: str
    label: str
    type: Optional[str] = None
    relationshipType: Optional[RelationshipType] = None
    confidence: float = 0.90
    frequency: int = 1
    amount: Optional[float] = None
    duration: Optional[str] = None
    timestamp: Optional[str] = "2026-08-26T12:00:00"
    isCrossCommunity: bool = False
    sourceCommunity: Optional[str] = None
    targetCommunity: Optional[str] = None
    isAnomaly: bool = False
    sourceRecord: Optional[str] = None
    sourceType: Optional[str] = "INGEST"

class CytoscapeEdge(BaseModel):
    data: CytoscapeEdgeData

class CommunityDetail(BaseModel):
    community_id: str
    label: str
    size: int
    internal_edges_count: int
    internal_density: float
    entity_type_distribution: Dict[str, int]
    dominant_relationship_types: List[Dict[str, Any]]
    most_central_entities: List[Dict[str, Any]]
    is_unusually_dense: bool = False
    density_deviation_percent: float = 0.0

class CrossCommunityLink(BaseModel):
    edge_id: str
    source: str
    target: str
    source_entity: Optional[str] = None
    target_entity: Optional[str] = None
    source_community: str
    target_community: str
    relationship_type: RelationshipType
    confidence: float
    timestamp: Optional[str] = "2026-08-26T12:00:00"
    source_centrality: Optional[float] = 0.0
    target_centrality: Optional[float] = 0.0
    source_record: Optional[str] = None

class BridgeEntity(BaseModel):
    entity_id: str
    entity_type: EntityType
    primary_community: str
    communities_connected: List[str]
    communities_connected_count: int
    cross_community_links_count: int
    betweenness_centrality: float
    degree_centrality: float
    attention_score: int
    evidence_snippet: str

class DetectedPattern(BaseModel):
    pattern_id: str
    pattern_type: PatternType
    severity: AlertSeverity
    confidence: float
    primary_entity_id: Optional[str] = None
    involved_entity_ids: List[str] = Field(default_factory=list)
    title: str
    timestamp: str
    evidence: List[str] = Field(default_factory=list)
    explanation: str
    metrics: Dict[str, Any] = Field(default_factory=dict)
    methodology: Dict[str, str] = Field(default_factory=dict)

class GraphMetrics(BaseModel):
    totalNodes: int = 0
    totalEdges: int = 0
    density: float = 0.0
    clusterCount: int = 0
    isolatedNodes: int = 0
    avgDegree: float = 0.0
    avgBetweenness: float = 0.0
    highestDegreeNode: Optional[str] = None
    highestBetweennessNode: Optional[str] = None
    total_nodes: Optional[int] = None
    total_edges: Optional[int] = None
    cluster_count: Optional[int] = None
    average_degree: Optional[float] = None

class NetworkGraphResponse(BaseModel):
    nodes: List[CytoscapeNode]
    edges: List[CytoscapeEdge]
    communities: List[CommunityDetail] = Field(default_factory=list)
    bridges: List[BridgeEntity] = Field(default_factory=list)
    metrics: Union[GraphMetrics, Dict[str, Any]] = Field(default_factory=dict)

class AlertMetricSchema(BaseModel):
    metric_name: str
    baseline_value: str
    observed_value: str

class AlertRelatedEntitySchema(BaseModel):
    id: str
    label: str
    type: EntityType
    role_in_alert: str

class AlertSchema(BaseModel):
    id: str
    case_id: str
    pattern_type: PatternType
    severity: AlertSeverity
    status: AlertStatus
    confidence: float
    entity_ids: List[str]
    title: str
    description: str
    explanation: str
    evidence: List[str]
    analytical_metrics: List[AlertMetricSchema]
    related_entities: List[AlertRelatedEntitySchema]
    created_at: str
    recommended_action: str

class AlertStatusUpdate(BaseModel):
    new_status: AlertStatus
    note: Optional[str] = None

class TimelineEventSchema(BaseModel):
    id: str
    timestamp: str
    source_entity: str
    source_entity_type: EntityType
    relationship: RelationshipType
    target_entity: str
    target_entity_type: EntityType
    source_record: str
    confidence: float
    category: str
    is_anomaly: bool = False
    notes: Optional[str] = None
    related_alert_ids: List[str] = Field(default_factory=list)

class CaseSchema(BaseModel):
    id: str
    name: str
    code_name: str
    status: CaseStatus
    priority: CasePriority
    lead_investigator: str
    badge_number: str
    department: str
    date_opened: str
    last_activity: str
    entity_count: int
    relationship_count: int
    flagged_alerts_count: int
    clusters_identified: int
    patterns_detected_count: int = 0
    tags: List[str]
    description: str
    objective: str
    key_findings: List[str]
    evidence_pointers: Dict[str, int]

class CaseCreateRequest(BaseModel):
    name: str
    description: str
    priority: CasePriority = CasePriority.HIGH
    lead_investigator: str = "Inspector Rajesh Verma"
    tags: List[str] = Field(default_factory=lambda: ["CYBER_FRAUD", "FINANCIAL_LAYERING"])

class AnalysisExecutionTelemetry(BaseModel):
    status: str
    case_id: str
    records_processed: int
    entities_discovered: int
    relationships_found: int
    communities_detected: int
    patterns_detected: int
    alerts_generated: int
    analysis_duration_seconds: float
    timestamp: str

class UploadValidationResponse(BaseModel):
    status: str
    filename: str
    category: str
    records_received: int
    records_valid: int
    records_rejected: int
    validation_errors: List[str] = Field(default_factory=list)
    sample_entities: List[Dict[str, Any]] = Field(default_factory=list)

class GraphBuildResponse(BaseModel):
    status: str
    case_id: str
    nodes_created: int
    relationships_created: int
    communities_detected: int
    execution_time_ms: float
    message: str

# Phase 4 Auth & User Schemas
class UserSchema(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    badge_number: str
    department: str
    is_active: bool = True

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSchema

# Phase 4 Notes Schemas
class NoteCreateRequest(BaseModel):
    content: str
    entity_id: Optional[str] = None

class NoteSchema(BaseModel):
    id: str
    case_id: str
    entity_id: Optional[str] = None
    author: str
    author_badge: str
    content: str
    created_at: str

# Phase 4 Audit Log Schema
class AuditLogSchema(BaseModel):
    id: str
    timestamp: str
    user_email: str
    user_name: str
    user_role: UserRole
    action: AuditAction
    case_id: Optional[str] = None
    entity_id: Optional[str] = None
    details: str

# Phase 4 Evidence Record Schema
class EvidenceRecordSchema(BaseModel):
    record_id: str
    case_id: str
    source_dataset: str
    record_type: str
    timestamp: str
    primary_entity: str
    counterparty_entity: str
    summary: str
    confidence: float
    sha256_hash: str

# Phase 4 Health Schema
class SystemHealthResponse(BaseModel):
    api_status: str
    neo4j_status: str
    analysis_engine_status: str
    uptime_seconds: float
    database_nodes: int
    database_edges: int
    active_communities: int
    environment: str = "SIH26189_PROTOTYPE"
