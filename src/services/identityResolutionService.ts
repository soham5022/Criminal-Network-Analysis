import { auditService } from './auditService';

export interface IdentityConflictSource {
  recordId: string;
  sourceName: string;
  value: string;
  timestamp: string;
}

export interface IdentityConflict {
  id: string;
  title: string;
  inconsistencyExplanation: string;
  status: 'REQUIRES_INVESTIGATOR_REVIEW' | 'RESOLVED' | 'DISMISSED';
  sourceA: IdentityConflictSource;
  sourceB: IdentityConflictSource;
}

export interface PotentialDuplicateEntity {
  id: string;
  primaryEntityId: string;
  candidateEntityId: string;
  candidateName: string;
  matchScore: number;
  matchTier: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING_REVIEW' | 'MERGED' | 'SEPARATED';
  whyMatchedReasons: string[];
  overlappingAttributes: {
    phones: string[];
    organizations: string[];
    addresses: string[];
  };
}

export interface ConnectedSourceRecord {
  id: string;
  sourceName: string;
  recordId: string;
  lastSeen: string;
  attributeLabel: string;
  attributeValue: string;
}

export interface UnifiedIdentityDossier {
  entityId: string;
  caseId: string;
  primaryLegalName: string;
  resolutionScore: number;
  aliases: string[];
  sourceRecords: ConnectedSourceRecord[];
  conflicts: IdentityConflict[];
  potentialDuplicates: PotentialDuplicateEntity[];
}

export interface IdentityMatchCandidate {
  id: string;
  sourceEntityId: string;
  sourceEntityLabel: string;
  sourceEntityType: string;
  sourceCaseId: string;
  sourceLocation: string;
  sourceDetails: string;

  targetEntityId: string;
  targetEntityLabel: string;
  targetEntityType: string;
  targetCaseId: string;
  targetLocation: string;
  targetDetails: string;

  confidenceScore: number; // e.g. 87
  matchingIndicators: {
    indicator: string;
    details: string;
  }[];
  conflicts: string[];
  status: 'PENDING_REVIEW' | 'CONFIRMED_MERGED' | 'KEPT_SEPARATE';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

const STORAGE_KEY = 'tracenet_identity_resolution_v1';

const INITIAL_MATCHES: IdentityMatchCandidate[] = [
  {
    id: 'ID-RES-2026-001',
    sourceEntityId: 'Person_044',
    sourceEntityLabel: 'Rahul Sharma',
    sourceEntityType: 'PERSON',
    sourceCaseId: 'CASE-1024',
    sourceLocation: 'Sector 4 Industrial Estate, Thane West, Maharashtra',
    sourceDetails: 'Primary Logistics Bridge Coordinator, Linked to Burner Phone (+91 98201 48291)',

    targetEntityId: 'Person_092',
    targetEntityLabel: 'R. S. Sharma',
    targetEntityType: 'PERSON',
    targetCaseId: 'CASE-1057',
    targetLocation: 'Ring Road Diamond Bourse, Surat, Gujarat',
    targetDetails: 'Consignment Clearing Agent, Listed with Vehicle MH-04-XX-2847',

    confidenceScore: 87,
    matchingIndicators: [
      { indicator: 'Name similarity', details: 'Phonetic & alias token match ("Rahul Sharma" ↔ "R. S. Sharma")' },
      { indicator: 'Shared phone reference', details: 'IMEI ping overlap with Burner Phone (+91 98201 48291)' },
      { indicator: 'Shared vehicle reference', details: 'Both records log Maruti Swift MH-04-XX-2847' },
      { indicator: 'Shared account reference', details: 'Both entities authorized transfers into Axis Bank ending 4821' }
    ],
    conflicts: [
      'Address differs across source records (Thane West vs Surat Bourse)',
      'Registered father name in FIR has single initial discrepancy (S. Sharma vs Satish Sharma)'
    ],
    status: 'PENDING_REVIEW'
  },
  {
    id: 'ID-RES-2026-002',
    sourceEntityId: 'Phone_021',
    sourceEntityLabel: '+91 XXXXX 28471',
    sourceEntityType: 'PHONE',
    sourceCaseId: 'CASE-1024',
    sourceLocation: 'Central Delhi Tower Sector 4',
    sourceDetails: 'Burner SIM subscribed under Ramesh Enterprises',

    targetEntityId: 'Phone_088',
    targetEntityLabel: '+91 XXXXX 91042',
    targetEntityType: 'PHONE',
    targetCaseId: 'CASE-1031',
    targetLocation: 'Mumbai Airport Gateway',
    targetDetails: 'Hardware cloned terminal matching IMEI 864201048291042',

    confidenceScore: 92,
    matchingIndicators: [
      { indicator: 'Hardware IMEI match', details: 'Identical transceiver chip 864201048291042 used across both IMSIs' },
      { indicator: 'Sequential activation time', details: 'Device 088 activated 14 minutes after Device 021 was deactivated' }
    ],
    conflicts: [
      'Subscriber identities registered under two distinct Aadhaar numbers (likely forged credentials)'
    ],
    status: 'PENDING_REVIEW'
  }
];

class IdentityResolutionService {
  private getStorage(): IdentityMatchCandidate[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
      }
    } catch {}
    return INITIAL_MATCHES;
  }

  private setStorage(items: IdentityMatchCandidate[]) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {}
  }

  public getCandidates(): IdentityMatchCandidate[] {
    return this.getStorage();
  }

  public getPendingCount(): number {
    return this.getStorage().filter(m => m.status === 'PENDING_REVIEW').length;
  }

  public confirmMatch(matchId: string, officerName: string = 'Inspector Rajesh Verma', notes?: string): IdentityMatchCandidate | null {
    const list = this.getStorage();
    const target = list.find(m => m.id === matchId);
    if (!target) return null;

    target.status = 'CONFIRMED_MERGED';
    target.reviewedBy = officerName;
    target.reviewedAt = new Date().toLocaleString('en-GB');
    target.notes = notes || 'Investigator verified biometric, IMEI, and ledger commonalities. Entity confirmed as identical individual.';

    this.setStorage(list);

    // Audit trail
    auditService.logAction({
      action: 'IDENTITY_MERGED',
      actionLabel: 'Confirmed Identity Resolution Match',
      module: 'Entities',
      caseId: target.sourceCaseId,
      recordId: target.id,
      recordType: 'ENTITY_MATCH',
      recordLabel: `${target.sourceEntityLabel} ↔ ${target.targetEntityLabel}`,
      status: 'SUCCESS',
      details: `Investigator confirmed ${target.confidenceScore}% identity match between ${target.sourceEntityId} (${target.sourceEntityLabel}) and ${target.targetEntityId} (${target.targetEntityLabel}). Knowledge graph cross-reference verified.`
    });

    return target;
  }

  public keepSeparate(matchId: string, officerName: string = 'Inspector Rajesh Verma', reason?: string): IdentityMatchCandidate | null {
    const list = this.getStorage();
    const target = list.find(m => m.id === matchId);
    if (!target) return null;

    target.status = 'KEPT_SEPARATE';
    target.reviewedBy = officerName;
    target.reviewedAt = new Date().toLocaleString('en-GB');
    target.notes = reason || 'Investigator reviewed physical evidence and confirmed separate persons despite shared contact references.';

    this.setStorage(list);

    // Audit trail
    auditService.logAction({
      action: 'IDENTITY_SEPARATED',
      actionLabel: 'Rejected Identity Merge (Kept Separate)',
      module: 'Entities',
      caseId: target.sourceCaseId,
      recordId: target.id,
      recordType: 'ENTITY_MATCH',
      recordLabel: `${target.sourceEntityLabel} ↮ ${target.targetEntityLabel}`,
      status: 'SUCCESS',
      details: `Investigator kept ${target.sourceEntityId} and ${target.targetEntityId} separate. Reason: ${target.notes}`
    });

    return target;
  }

  public getIdentityResolutionData(entityId: string, caseId: string): UnifiedIdentityDossier {
    const candidate = this.getStorage().find(m => m.sourceEntityId === entityId || m.targetEntityId === entityId);
    
    return {
      entityId,
      caseId,
      primaryLegalName: candidate ? (candidate.sourceEntityId === entityId ? candidate.sourceEntityLabel : candidate.targetEntityLabel) : (entityId === 'Person_044' ? 'Rahul Sharma' : 'Identified Subject'),
      resolutionScore: candidate ? candidate.confidenceScore : 85,
      aliases: ['R. Sharma', 'Sharmaji (Logistics)', 'RS-44'],
      sourceRecords: [
        {
          id: 'SRC-1',
          sourceName: 'Telecom CDR Registry',
          recordId: 'CDR-2026-08-991',
          lastSeen: '24 Aug 2026',
          attributeLabel: 'Registered Mobile',
          attributeValue: '+91 98201 48291'
        },
        {
          id: 'SRC-2',
          sourceName: 'Core Banking Financial Ledger',
          recordId: 'FIN-TX-48210',
          lastSeen: '21 Aug 2026',
          attributeLabel: 'Primary Beneficiary Account',
          attributeValue: 'Axis Bank A/C ...4821'
        },
        {
          id: 'SRC-3',
          sourceName: 'Automated Number Plate Recognition (ANPR)',
          recordId: 'ANPR-MH04-88',
          lastSeen: '18 Aug 2026',
          attributeLabel: 'Registered Vehicle',
          attributeValue: 'MH-04-XX-2847'
        },
        {
          id: 'SRC-4',
          sourceName: 'National FIR & Crime Repository',
          recordId: 'FIR-2024-819',
          lastSeen: '12 May 2024',
          attributeLabel: 'Prior Case Record',
          attributeValue: 'EOW Charge Sheet 1031'
        }
      ],
      conflicts: [
        {
          id: 'CONF-01',
          title: 'Address Verification Discrepancy Across Jurisdictions',
          inconsistencyExplanation: 'Telecom subscriber KYC specifies Thane West Industrial Area whereas Banking KYC lists Surat Diamond Bourse commercial office.',
          status: 'REQUIRES_INVESTIGATOR_REVIEW',
          sourceA: {
            recordId: 'KYC-TEL-991',
            sourceName: 'Telecom Subscriber Database',
            value: 'Sector 4 Industrial Estate, Thane West, MH',
            timestamp: '2026-01-14'
          },
          sourceB: {
            recordId: 'KYC-BNK-482',
            sourceName: 'Axis Bank Core Account Profile',
            value: 'Shop 14, Ring Road Diamond Bourse, Surat, GJ',
            timestamp: '2025-11-20'
          }
        }
      ],
      potentialDuplicates: [
        {
          id: 'DUP-01',
          primaryEntityId: entityId,
          candidateEntityId: candidate ? (candidate.sourceEntityId === entityId ? candidate.targetEntityId : candidate.sourceEntityId) : 'Person_092',
          candidateName: candidate ? (candidate.sourceEntityId === entityId ? candidate.targetEntityLabel : candidate.sourceEntityLabel) : 'R. S. Sharma',
          matchScore: candidate ? candidate.confidenceScore : 87,
          matchTier: 'HIGH',
          status: 'PENDING_REVIEW',
          whyMatchedReasons: [
            'Phonetic and abbreviation similarity (Rahul Sharma ↔ R. S. Sharma)',
            'Identical IMEI telemetry handset ping within 20 minutes',
            'Registered co-ownership on seized transport vehicle MH-04-XX-2847'
          ],
          overlappingAttributes: {
            phones: ['+91 98201 48291'],
            organizations: ['Apex Logistics Hub', 'Meridian Enterprises'],
            addresses: ['Sector 4 Industrial Estate, Thane West']
          }
        }
      ]
    };
  }

  public resolveConflict(conflictId: string, decision: 'SAME_ENTITY' | 'KEEP_SEPARATE', notes: string): void {
    auditService.logAction({
      action: decision === 'SAME_ENTITY' ? 'IDENTITY_MERGED' : 'IDENTITY_SEPARATED',
      actionLabel: `Resolved Identity Conflict (${decision})`,
      module: 'Entities',
      recordId: conflictId,
      status: 'SUCCESS',
      details: `Investigator resolved conflict ${conflictId} with decision: ${decision}. Notes: ${notes}`
    });
  }

  public resolveDuplicateCandidate(duplicateId: string, decision: 'MERGE' | 'SEPARATE', notes: string): void {
    if (decision === 'MERGE') {
      this.confirmMatch(duplicateId, 'Inspector Rajesh Verma', notes);
    } else {
      this.keepSeparate(duplicateId, 'Inspector Rajesh Verma', notes);
    }
  }
}

export const identityResolutionService = new IdentityResolutionService();
