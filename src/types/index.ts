export type EntityType = 
  | 'PERSON' 
  | 'PHONE' 
  | 'ACCOUNT' 
  | 'LOCATION' 
  | 'ORGANIZATION' 
  | 'VEHICLE'
  | 'EVENT';

export type AnalyticalPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';

export interface AttentionScoreFactor {
  name: string;
  points: number;
  reason: string;
}

export interface Entity {
  id: string; // e.g. "Person_044"
  label: string; // Fictional display name or code
  name?: string;
  type: EntityType;
  community: string | number; // e.g. "Cluster 01" or 1
  analyticalPriority: AnalyticalPriority;
  attentionScore?: number; // 0 - 100
  degreeCentrality: number; // 0.00 - 1.00
  betweennessCentrality: number; // 0.00 - 1.00
  degree?: number;
  betweenness?: number;
  risk_score?: number;
  caseId?: string;
  closenessCentrality?: number;
  eigenvectorCentrality?: number;
  pagerank?: number;
  crossCommunityLinks?: number;
  communitiesConnectedCount?: number;
  isBridge?: boolean;
  connectionsCount: number;
  locationsCount: number;
  phonesCount: number;
  accountsCount: number;
  organizationsCount: number;
  vehiclesCount: number;
  lastActivity: string; // ISO or relative timestamp
  firstSeen: string;
  associatedCaseIds: string[];
  keyConnections: string[]; // IDs of top linked entities
  attentionFactors?: AttentionScoreFactor[];
  relatedAlertsCount?: number;
  phone?: string;
  accountNumber?: string;
  metadata: {
    description?: string;
    alias?: string;
    carrierOrBank?: string;
    jurisdiction?: string;
    ipOrCoordinates?: string;
    confidenceScore: number;
    flags?: string[];
  };
}


export type RelationshipType = 
  | 'CALLED' 
  | 'TRANSFERRED' 
  | 'VISITED' 
  | 'ASSOCIATED_WITH' 
  | 'OWNS_DEVICE'
  | 'TRAVELS_IN'
  | 'OWNED' 
  | 'MET'
  | 'CO_LOCATED'
  | 'MEMBER_OF'
  | 'USES'
  | 'ATTENDED'
  | 'INVOLVED_IN'
  | 'PRESENT_AT'
  | 'HOSTED'
  | 'TRIGGERED'
  | 'WITNESSED'
  | 'CROSS_CASE_LINK';

export interface Relationship {
  id: string;
  source: string; // Entity ID
  target: string; // Entity ID
  type: RelationshipType;
  timestamp: string;
  confidence: number; // 0.00 - 1.00
  frequency?: number;
  amount?: number; // For TRANSFERRED
  currency?: string;
  duration?: string; // For CALLED
  locationName?: string; // For VISITED
  flaggedAnomaly?: boolean;
  isCrossCommunity?: boolean;
  isCrossCase?: boolean;
  crossCaseCaseId?: string;
  sourceCommunity?: string;
  targetCommunity?: string;
  sourceType: string;
  provenance?: {
    sourceRecordId: string;
    sourceType: string;
    caseId: string;
    timestamp: string;
    confidence: number;
  };
  notes?: string;
}

// Event entity specific fields
export interface EventEntity {
  id: string;
  label: string;
  type: 'EVENT';
  eventType: 'INCIDENT' | 'MEETING' | 'SURVEILLANCE' | 'TRANSACTION' | 'ARREST' | 'SEARCH_SEIZURE' | 'INTELLIGENCE' | 'OTHER';
  date: string;
  time?: string;
  location?: string;
  description: string;
  involvedEntities: string[];
  caseId: string;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'CONFIRMED' | 'UNVERIFIED' | 'UNDER_REVIEW';
  sourceRecord?: string;
}

// Social Intelligence record
export interface SocialIntelRecord {
  id: string;
  caseId: string;
  platform: string;
  accountRef: string;
  subject: string;
  subjectEntityId?: string;
  date: string;
  time: string;
  location?: string;
  relatedEntities: string[];
  content: string;
  sourceReference: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'UNVERIFIED' | 'REQUIRES_REVIEW' | 'CONFIRMED_LEAD' | 'DISMISSED';
  registeredBy: string;
  registeredDate: string;
  attachments?: string[];
  tags?: string[];
}

// Criminal History record
export interface CriminalHistoryRecord {
  id: string;
  personEntityId: string;
  personName: string;
  previousCaseId: string;
  firReference: string;
  offenceCategory: string;
  offenceDate: string;
  policeStation: string;
  caseStatus: string;
  disposition: string;
  sourceReference: string;
  notes?: string;
  linkedCurrentCaseId: string;
  registeredBy: string;
  registeredDate: string;
}

export type CaseStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'CRITICAL_LEAD' | 'CLOSED' | 'ARCHIVED';
export type CasePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'ROUTINE';

export interface Case {
  id: string; // e.g. "CASE-1024"
  name: string; // "Operation Meridian"
  codeName: string; // "MERIDIAN_ALPHA"
  status: CaseStatus;
  priority: CasePriority;
  leadInvestigator: string;
  badgeNumber: string;
  department: string;
  dateOpened: string;
  lastActivity: string;
  entityCount: number;
  relationshipCount: number;
  flaggedAlertsCount: number;
  clustersIdentified: number;
  patternsDetectedCount?: number;
  tags: string[];
  description: string;
  objective: string;
  keyFindings: string[];
  evidencePointers: {
    firCount: number;
    cdrLogsCount: number;
    bankTransactionsCount: number;
    incidentReportsCount: number;
  };
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'NEW' | 'INVESTIGATING' | 'REVIEWED' | 'DISMISSED';

export type PatternType = 
  | 'CROSS_COMMUNITY_BRIDGE'
  | 'DENSE_NETWORK_CLUSTER'
  | 'RAPID_RELATIONSHIP_EXPANSION'
  | 'TRANSACTION_ANOMALY'
  | 'TEMPORAL_CORRELATION'
  | 'HIGH_BETWEENNESS_ENTITY'
  | 'MULTI_MODAL_CONVERGENCE';

export interface AlertMetric {
  metricName: string;
  baselineValue: string;
  observedValue: string;
}

export interface AlertRelatedEntity {
  id: string;
  label: string;
  type: EntityType;
  roleInAlert: string;
}

export interface Alert {
  id: string; // "ALT-9041"
  title: string;
  category: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  reason: string;
  evidenceRef?: string;
  explanation: string;
  analyticalMetrics: AlertMetric[];
  relatedEntities: AlertRelatedEntity[];
  associatedCaseId: string;
  recommendedAction: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeDisplay?: string;
  dateDisplay?: string;
  dateFormatted?: string;
  timeFormatted?: string;
  sourceEntity?: string;
  sourceEntityId?: string;
  sourceEntityLabel?: string;
  sourceType?: EntityType;
  sourceEntityType?: string;
  relationship: RelationshipType | string;
  targetEntity?: string;
  targetEntityId?: string;
  targetEntityLabel?: string;
  targetType?: EntityType;
  targetEntityType?: string;
  sourceRecord?: string;
  sourceCategory?: string;
  importance?: string;
  summary?: string;
  description?: string;
  details?: string;
  confidence: number;
  category?: 'COMMUNICATION' | 'FINANCIAL' | 'PHYSICAL_SURVEILLANCE' | 'INTELLIGENCE_REPORT' | string;
  associatedCaseId: string;
  flaggedAnomaly?: boolean;
  notes?: string;
  metadata?: {
    duration?: string;
    amount?: string;
    location?: string;
    tower?: string;
    [key: string]: any;
  };
}


export interface IntelligenceReport {
  id: string;
  title?: string;
  author?: string;
  agency?: string;
  reportNumber?: string;
  generatedDate?: string;
  caseId: string;
  caseName?: string;
  classificationLevel?: 'SECRET // LAW ENFORCEMENT ONLY' | 'CONFIDENTIAL' | 'RESTRICTED';
  classification?: string;
  preparedFor?: string;
  leadInvestigator?: string;
  executiveSummary?: string;
  networkSummary?: {
    totalEntities: number;
    totalRelationships: number;
    clustersIdentified: number;
    criticalBridgeNodes?: string[];
    topAnomalies?: string[];
  };
  keyFindings?: string[];
  priorityEntities?: Entity[];
  keyEntities?: any[];
  criticalAlerts?: Alert[];
  recommendations?: string[];
  disclaimer?: string;
  [key: string]: any;
}

export interface IngestionDataset {
  id: string;
  name: string;
  type?: 'CDR' | 'FIR' | 'FINANCIAL' | 'INCIDENT';
  category?: 'CDR' | 'FIR' | 'FINANCIAL' | 'INCIDENT';
  fileFormat?: 'CSV' | 'PDF' | 'XLSX' | 'JSON';
  fileSize?: string;
  recordCount: number;
  estimatedEntities?: number;
  estimatedRelationships?: number;
  uploadedAt?: string;
  status: 'READY' | 'INGESTING' | 'INDEXED' | 'FLAGGED_ERRORS' | 'COMPLETED' | 'PENDING';
  description?: string;
}

