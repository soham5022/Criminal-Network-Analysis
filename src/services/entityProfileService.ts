import { EntityType, AnalyticalPriority } from '../types';
import { mockEntities } from '../data/mockEntities';
import { mockRelationships } from '../data/mockRelationships';
import { mockAlerts } from '../data/mockAlerts';
import { mockTimelineEvents } from '../data/mockTimeline';
import { calculateAttentionScore } from '../components/network/communityLayout';

export interface IdentityDocument {
  docType: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'DRIVING_LICENSE' | 'CIN';
  docName: string;
  maskedNumber: string;
  unmaskedNumber: string;
  issuingAuthority: string;
  syntheticDisclaimer: string;
}

export interface AssociatedPhone {
  id: string;
  number: string;
  status: 'PRIMARY_ACTIVE' | 'SECONDARY_ACTIVE' | 'HISTORICAL_BURNER';
  carrier: string;
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  firstSeen: string;
  lastSeen: string;
  sourceRecord: string;
}

export interface AssociatedAccount {
  id: string;
  accountNumber: string;
  bankName: string;
  ifscOrSwift: string;
  status: 'ACTIVE_RELAY' | 'SECONDARY' | 'DORMANT' | 'FROZEN';
  totalTransactions: number;
  totalIncoming: number;
  totalOutgoing: number;
  recentActivitySummary: string;
  firstSeen: string;
  lastActivity: string;
  sourceRecord: string;
}

export interface AssociatedVehicle {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  makeModel: string;
  status: 'OBSERVED_TRANSIT' | 'REGISTERED_ASSET' | 'CO_LOCATED';
  tollObservationsCount: number;
  firstSeen: string;
  lastSeen: string;
  sourceRecord: string;
}

export interface AssociatedLocation {
  id: string;
  name: string;
  locationType: 'RESIDENTIAL' | 'WAREHOUSE_DEPOT' | 'SAFEHOUSE' | 'SURVEILLANCE_HOTSPOT';
  coordinates: string;
  jurisdiction: string;
  observationCount: number;
  firstSeen: string;
  lastSeen: string;
  sourceRecord: string;
}

export interface AssociatedOrganization {
  id: string;
  name: string;
  role: 'DIRECTOR_PROXY' | 'HOLDING_LEASE' | 'BENEFICIAL_OWNER' | 'AFFILIATED';
  cinNumber: string;
  registeredAddress: string;
  sourceRecord: string;
}

export interface DirectRelationshipRecord {
  targetEntityId: string;
  targetEntityLabel: string;
  targetEntityType: EntityType;
  relationshipType: string;
  interactionCount: number;
  firstSeen: string;
  lastSeen: string;
  confidence: number;
  sourceRecord: string;
}

export interface EntityDossier {
  entityId: string;
  label: string;
  type: EntityType;
  fullName: string;
  aliases: string[];
  dateOfBirth: string;
  nationality: string;
  gender?: string;
  occupation: string;
  organization?: string;
  caseStatus: string;
  primaryCaseId: string;
  allInvolvedCases: Array<{ caseId: string; caseName: string; role: string }>;
  communityGroup: string;
  priority: AnalyticalPriority;
  attentionScore: number;
  attentionFactors: Array<{ factor: string; points: string; reason: string }>;
  isBridge: boolean;
  betweennessCentrality: number;
  degreeConnectivity: number;
  crossCommunityLinksCount: number;
  identityDocuments: IdentityDocument[];
  associatedPhones: AssociatedPhone[];
  associatedAccounts: AssociatedAccount[];
  associatedVehicles: AssociatedVehicle[];
  associatedLocations: AssociatedLocation[];
  associatedOrganizations: AssociatedOrganization[];
  relationships: DirectRelationshipRecord[];
  timelineEvents: Array<{
    id: string;
    dateDisplay: string;
    summary: string;
    details: string;
    category: string;
    importance: string;
    type?: string;
  }>;
  alerts: Array<{
    id: string;
    title: string;
    severity: string;
    status: string;
    reason: string;
    timestamp: string;
  }>;
  evidenceRecords: Array<{
    id: string;
    title: string;
    sourceType: string;
    timestamp: string;
    integrityHash: string;
    status: string;
  }>;
  executiveSummaryText: string;
}

// Preset Synthetic Names & Demographics dictionary
const SYNTHETIC_DEMO_NAMES: Record<string, { name: string; aliases: string[]; occupation: string; dob: string; gender: string }> = {
  Person_044: {
    name: 'Rahul Sharma',
    aliases: ['Ravi', 'R. Sharma', 'Logistics Operator'],
    occupation: 'Logistics Transshipment Coordinator',
    dob: '1984-07-14 (Age 42)',
    gender: 'Male'
  },
  Person_001: {
    name: 'Vikram Singh',
    aliases: ['Apex', 'V. Singh', 'Finance Controller'],
    occupation: 'Commercial Finance Director',
    dob: '1979-11-23 (Age 46)',
    gender: 'Male'
  },
  Person_014: {
    name: 'Neha Verma',
    aliases: ['N. Verma', 'Dispatch Lead'],
    occupation: 'Western Corridor Dispatch Coordinator',
    dob: '1990-03-12 (Age 36)',
    gender: 'Female'
  },
  Person_027: {
    name: 'Rohan Deshmukh',
    aliases: ['Fleet Lead', 'R. Deshmukh'],
    occupation: 'Transport Fleet Operator',
    dob: '1982-09-05 (Age 43)',
    gender: 'Male'
  },
  Person_078: {
    name: 'Amit Patil',
    aliases: ['Vanguard', 'A. Patil', 'Terminal Lead'],
    occupation: 'Maritime Terminal Representative',
    dob: '1976-12-30 (Age 49)',
    gender: 'Male'
  }
};

export const entityProfileService = {
  get360Profile(entityId: string, caseId?: string): EntityDossier {
    const baseEntity = mockEntities.find(e => e.id.toLowerCase() === entityId.toLowerCase());
    const effectiveCaseId = caseId || baseEntity?.associatedCaseIds?.[0] || 'CASE-1024';
    const entityType: EntityType = baseEntity?.type || (
      entityId.startsWith('Phone') ? 'PHONE' :
      entityId.startsWith('Account') ? 'ACCOUNT' :
      entityId.startsWith('Location') ? 'LOCATION' :
      entityId.startsWith('Organization') ? 'ORGANIZATION' :
      entityId.startsWith('Vehicle') ? 'VEHICLE' : 'PERSON'
    );

    const demoDemo = SYNTHETIC_DEMO_NAMES[entityId] || {
      name: baseEntity?.label || baseEntity?.name || entityId,
      aliases: [baseEntity?.metadata?.alias || `${entityId}-Alias`],
      occupation: entityType === 'PERSON' ? 'Operational Contact' : `${entityType} Asset`,
      dob: '1985-05-15 (Age 41)',
      gender: 'Male'
    };

    // Calculate score
    const rawBetweenness = baseEntity?.betweennessCentrality ?? baseEntity?.betweenness ?? 0.35;
    const rawDegree = baseEntity?.degree ?? baseEntity?.connectionsCount ?? 6;
    const rawCross = baseEntity?.crossCommunityLinks ?? (rawBetweenness > 0.4 ? 4 : 1);
    const isBridge = (baseEntity?.isBridge ?? false) || rawBetweenness >= 0.5;

    const { score, factors } = calculateAttentionScore(
      entityId,
      rawBetweenness,
      rawDegree,
      rawCross,
      baseEntity?.relatedAlertsCount || (isBridge ? 2 : 0),
      baseEntity?.analyticalPriority || 'HIGH'
    );

    // Synthetic Identity Documents (Masked)
    const suffix = (entityId.replace(/\D/g, '') || '4821').padStart(4, '0').slice(-4);
    const identityDocuments: IdentityDocument[] = [
      {
        docType: 'AADHAAR',
        docName: 'Aadhaar Card (UIDAI)',
        maskedNumber: `XXXX-XXXX-${suffix}`,
        unmaskedNumber: `9182-4412-${suffix} (Synthetic Demo Record)`,
        issuingAuthority: 'Government of India / UIDAI',
        syntheticDisclaimer: 'Synthetic demonstration identifier for testing only.'
      },
      {
        docType: 'PAN',
        docName: 'Permanent Account Number (PAN)',
        maskedNumber: `XXXXX${suffix}X`,
        unmaskedNumber: `ABCDE${suffix}F (Synthetic Demo Record)`,
        issuingAuthority: 'Income Tax Department (CBDT)',
        syntheticDisclaimer: 'Synthetic demonstration identifier for testing only.'
      },
      {
        docType: 'PASSPORT',
        docName: 'Republic of India Passport',
        maskedNumber: `PXXXX${suffix}`,
        unmaskedNumber: `P982${suffix} (Synthetic Demo Record)`,
        issuingAuthority: 'Ministry of External Affairs (RPO Mumbai)',
        syntheticDisclaimer: 'Synthetic demonstration identifier for testing only.'
      }
    ];

    // Associated Phones
    const associatedPhones: AssociatedPhone[] = [
      {
        id: 'Phone_021',
        number: '+91 XXXXX 28471',
        status: 'PRIMARY_ACTIVE',
        carrier: 'Telecom Sentinel Grid (VoLTE)',
        totalCalls: 48,
        inboundCalls: 18,
        outboundCalls: 30,
        firstSeen: '2026-06-01',
        lastSeen: 'Today, 14:15 UTC',
        sourceRecord: 'CDR_00441'
      },
      {
        id: 'Phone_045',
        number: '+91 XXXXX 73142',
        status: 'HISTORICAL_BURNER',
        carrier: 'AeroConnect Telecom',
        totalCalls: 14,
        inboundCalls: 4,
        outboundCalls: 10,
        firstSeen: '2026-06-18',
        lastSeen: '3 days ago',
        sourceRecord: 'CDR_00892'
      }
    ];

    // Associated Bank Accounts
    const associatedAccounts: AssociatedAccount[] = [
      {
        id: 'Account_103',
        accountNumber: 'XXXX XXXX 4821',
        bankName: 'Demo National Bank',
        ifscOrSwift: 'DNBL0004',
        status: 'ACTIVE_RELAY',
        totalTransactions: 47,
        totalIncoming: 240000,
        totalOutgoing: 218500,
        recentActivitySummary: 'Rapid structured relay disbursements under statutory ₹50k cap.',
        firstSeen: '2026-05-10',
        lastActivity: 'Today, 14:32 UTC',
        sourceRecord: 'BANK_00192'
      },
      {
        id: 'Account_221',
        accountNumber: 'XXXX XXXX 7316',
        bankName: 'Metro Cooperative Bank',
        ifscOrSwift: 'MCBL0091',
        status: 'SECONDARY',
        totalTransactions: 19,
        totalIncoming: 185000,
        totalOutgoing: 180000,
        recentActivitySummary: 'Layered beneficiary disbursements.',
        firstSeen: '2026-06-12',
        lastActivity: 'Yesterday, 11:20 UTC',
        sourceRecord: 'BANK_00284'
      }
    ];

    // Associated Vehicles
    const associatedVehicles: AssociatedVehicle[] = [
      {
        id: 'Vehicle_017',
        registrationNumber: 'MH-04-XX-2847',
        vehicleType: 'White Maruti Swift',
        makeModel: 'Maruti Suzuki Swift VXi',
        status: 'OBSERVED_TRANSIT',
        tollObservationsCount: 14,
        firstSeen: '2026-06-08',
        lastSeen: 'Today, 07:10 UTC',
        sourceRecord: 'ANPR_00881'
      }
    ];

    // Associated Locations
    const associatedLocations: AssociatedLocation[] = [
      {
        id: 'Location_A',
        name: 'Thane West Logistics Hub',
        locationType: 'WAREHOUSE_DEPOT',
        coordinates: '19.2183° N, 72.9781° E',
        jurisdiction: 'Thane Industrial Zone, Maharashtra',
        observationCount: 18,
        firstSeen: '2026-04-10',
        lastSeen: 'Today, 11:15 UTC',
        sourceRecord: 'CCTV_00412'
      },
      {
        id: 'Location_B',
        name: 'Vashi Safehouse Facility',
        locationType: 'SAFEHOUSE',
        coordinates: '19.0771° N, 72.9986° E',
        jurisdiction: 'Navi Mumbai Transit District',
        observationCount: 8,
        firstSeen: '2026-06-25',
        lastSeen: 'Yesterday, 19:10 UTC',
        sourceRecord: 'ANPR_00492'
      }
    ];

    // Associated Organizations
    const associatedOrganizations: AssociatedOrganization[] = [
      {
        id: 'Organization_X',
        name: 'Meridian Logistics Pvt. Ltd.',
        role: 'DIRECTOR_PROXY',
        cinNumber: 'U61100MH2024PTC4821',
        registeredAddress: 'Sector 4 Industrial Enclave, Thane West, Maharashtra',
        sourceRecord: 'ROC_CORP_0019'
      }
    ];

    // Dynamic Direct Relationships
    const relationships: DirectRelationshipRecord[] = mockRelationships
      .filter(r => r.source.toLowerCase() === entityId.toLowerCase() || r.target.toLowerCase() === entityId.toLowerCase())
      .map(r => {
        const isSource = r.source.toLowerCase() === entityId.toLowerCase();
        const otherId = isSource ? r.target : r.source;
        const otherEntity = mockEntities.find(e => e.id.toLowerCase() === otherId.toLowerCase());

        return {
          targetEntityId: otherId,
          targetEntityLabel: otherEntity?.label || otherEntity?.name || otherId,
          targetEntityType: otherEntity?.type || 'PERSON',
          relationshipType: r.type,
          interactionCount: r.frequency || 6,
          firstSeen: r.timestamp || '2026-08-10',
          lastSeen: r.timestamp || '2026-08-26',
          confidence: r.confidence || 0.92,
          sourceRecord: r.sourceType || 'CDR_00441'
        };
      });

    // Timeline Events
    const entityTimeline = mockTimelineEvents
      .filter(e => (e.sourceEntityId && e.sourceEntityId.toLowerCase() === entityId.toLowerCase()) || (e.targetEntityId && e.targetEntityId.toLowerCase() === entityId.toLowerCase()))
      .map(e => ({
        id: e.id,
        dateDisplay: e.dateDisplay || '26 Aug 2026',
        summary: e.summary || '',
        details: e.details || '',
        category: e.sourceCategory || 'INVESTIGATION',
        importance: e.importance || 'MEDIUM',
        type: e.sourceCategory || 'INVESTIGATION'
      }));

    // Alerts
    const entityAlerts = mockAlerts
      .filter(a => a.relatedEntities.some(re => re.id.toLowerCase() === entityId.toLowerCase()))
      .map(a => ({
        id: a.id,
        title: a.title,
        severity: a.severity,
        status: a.status,
        reason: a.reason,
        timestamp: a.timestamp
      }));

    // Evidence
    const evidenceRecords = [
      {
        id: `EVD-${suffix}-01`,
        title: `Telecom Intercept CDR Log - ${demoDemo.name}`,
        sourceType: 'SYNTHETIC_CDR',
        timestamp: '2026-08-26 14:15 UTC',
        integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        status: 'VERIFIED_HASH'
      },
      {
        id: `EVD-${suffix}-02`,
        title: `ANPR Surveillance Gate Hit - ${demoDemo.name}`,
        sourceType: 'SYNTHETIC_ANPR',
        timestamp: '2026-08-26 07:10 UTC',
        integrityHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        status: 'VERIFIED_HASH'
      },
      {
        id: `EVD-${suffix}-03`,
        title: `Banking Ledger Swift Transmission - Account ending 4821`,
        sourceType: 'SYNTHETIC_BANKING',
        timestamp: '2026-08-25 18:30 UTC',
        integrityHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
        status: 'VERIFIED_HASH'
      }
    ];

    const executiveSummaryText = isBridge
      ? `${demoDemo.name} serves as a critical operational bridge between separate clusters within ${caseId}. Demonstrates high betweenness centrality (${rawBetweenness.toFixed(2)}) mediating communications between financial coordinators and transit logistics.`
      : `${demoDemo.name} is an active investigative entity in ${caseId} classified under priority ${baseEntity?.analyticalPriority || 'HIGH'} with direct connectivity to key subjects.`;

    return {
      entityId,
      label: demoDemo.name,
      type: entityType,
      fullName: demoDemo.name,
      aliases: demoDemo.aliases,
      dateOfBirth: demoDemo.dob,
      nationality: 'Indian (Synthetic Demographics)',
      gender: demoDemo.gender,
      occupation: demoDemo.occupation,
      organization: 'Meridian Logistics Pvt. Ltd.',
      caseStatus: 'Under Active Investigation',
      primaryCaseId: effectiveCaseId,
      allInvolvedCases: [
        { caseId: 'CASE-1024', caseName: 'Operation Meridian', role: 'Bridge Node & Primary Logistics Coordinator' },
        { caseId: 'CASE-1031', caseName: 'Project Shadowline', role: 'Burner SIM Counterparty' }
      ],
      communityGroup: String(baseEntity?.community || 'Cluster 03'),
      priority: baseEntity?.analyticalPriority || 'HIGH',
      attentionScore: score,
      attentionFactors: factors,
      isBridge,
      betweennessCentrality: rawBetweenness,
      degreeConnectivity: rawDegree,
      crossCommunityLinksCount: rawCross,
      identityDocuments,
      associatedPhones,
      associatedAccounts,
      associatedVehicles,
      associatedLocations,
      associatedOrganizations,
      relationships,
      timelineEvents: entityTimeline,
      alerts: entityAlerts,
      evidenceRecords,
      executiveSummaryText
    };
  }
};
