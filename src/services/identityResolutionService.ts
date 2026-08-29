export type IdentitySourceType = 
  | 'KYC_REGISTRY'
  | 'TELECOM_CDR'
  | 'BANKING_CORE'
  | 'VEHICLE_ANPR'
  | 'INCIDENT_FIR'
  | 'ROC_CORPORATE'
  | 'CASE_DOSSIER';

export interface SourceRecordAttribute {
  id: string;
  sourceType: IdentitySourceType;
  sourceName: string;
  recordId: string;
  attributeType: 'NAME' | 'ALIAS' | 'PHONE' | 'ACCOUNT' | 'VEHICLE' | 'ADDRESS' | 'DOB' | 'NATIONALITY' | 'ORGANIZATION';
  attributeLabel: string;
  attributeValue: string;
  maskedValue: string;
  firstSeen: string;
  lastSeen: string;
  verificationStatus: 'VERIFIED_SOURCE' | 'REPORTED_ALIAS' | 'UNVERIFIED_SOURCE' | 'CONFLICTING_SOURCE';
  confidenceScore: number;
}

export interface IdentityAliasRecord {
  id: string;
  aliasName: string;
  aliasType: 'PRIMARY_LEGAL_NAME' | 'REPORTED_ALIAS' | 'SOURCE_RECORD_ALIAS' | 'UNVERIFIED_IDENTITY';
  sourceName: string;
  sourceRecordId: string;
  firstSeen: string;
  lastSeen: string;
  verificationStatus: string;
  notes: string;
}

export interface IdentityConflict {
  id: string;
  entityId: string;
  title: string;
  conflictType: 'NAME_SPELLING_VARIANCE' | 'DOB_MISMATCH' | 'ADDRESS_INCONSISTENCY' | 'IDENTIFIER_REUSE';
  sourceA: {
    sourceName: string;
    recordId: string;
    value: string;
    timestamp: string;
  };
  sourceB: {
    sourceName: string;
    recordId: string;
    value: string;
    timestamp: string;
  };
  inconsistencyExplanation: string;
  status: 'REQUIRES_INVESTIGATOR_REVIEW' | 'RESOLVED_SAME_ENTITY' | 'RESOLVED_KEEP_SEPARATE';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface PotentialDuplicateEntity {
  id: string;
  primaryEntityId: string;
  candidateEntityId: string;
  candidateName: string;
  matchScore: number; // 0 - 100
  matchTier: 'MATCHED' | 'POSSIBLE_MATCH' | 'UNRESOLVED';
  whyMatchedReasons: string[];
  overlappingAttributes: {
    phones: string[];
    accounts: string[];
    addresses: string[];
    organizations: string[];
  };
  sourceRecords: string[];
  status: 'PENDING_REVIEW' | 'CONFIRMED_MERGE' | 'CONFIRMED_SEPARATE';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface IdentityEvolutionStep {
  id: string;
  year: string;
  date: string;
  eventType: 'KYC_REGISTRATION' | 'TELECOM_ACTIVATION' | 'BANK_OPENING' | 'VEHICLE_REGISTRATION' | 'INCIDENT_RECORDED' | 'CORPORATE_FILING';
  summary: string;
  details: string;
  sourceName: string;
  recordId: string;
}

export interface UnifiedIdentityDossier {
  entityId: string;
  primaryLegalName: string;
  resolutionScore: number; // 0 - 100
  resolutionStatus: 'UNIFIED_CONFIRMED' | 'PARTIALLY_RESOLVED' | 'CONFLICTS_PENDING';
  sourceRecords: SourceRecordAttribute[];
  aliases: IdentityAliasRecord[];
  conflicts: IdentityConflict[];
  potentialDuplicates: PotentialDuplicateEntity[];
  evolutionTimeline: IdentityEvolutionStep[];
}

const STORAGE_KEY_CONFLICTS = 'tracenet_identity_conflicts_v1';
const STORAGE_KEY_DUPLICATES = 'tracenet_identity_duplicates_v1';

export const identityResolutionService = {
  getIdentityResolutionData(entityId: string, caseId: string = 'CASE-1024'): UnifiedIdentityDossier {
    const suffix = (entityId.replace(/\D/g, '') || '4821').padStart(4, '0').slice(-4);
    
    // 1. Cross-Source Attributes
    const sourceRecords: SourceRecordAttribute[] = [
      {
        id: `REC_${suffix}_01`,
        sourceType: 'KYC_REGISTRY',
        sourceName: 'Synthetic Identity / KYC Registry',
        recordId: `KYC-UIDAI-${suffix}`,
        attributeType: 'NAME',
        attributeLabel: 'Legal Full Name',
        attributeValue: entityId === 'Person_044' ? 'Rahul Sharma' : `${entityId} Registered Name`,
        maskedValue: entityId === 'Person_044' ? 'Rahul Sharma' : `${entityId} Registered Name`,
        firstSeen: '2023-04-12',
        lastSeen: '2026-06-10',
        verificationStatus: 'VERIFIED_SOURCE',
        confidenceScore: 0.98
      },
      {
        id: `REC_${suffix}_02`,
        sourceType: 'KYC_REGISTRY',
        sourceName: 'Synthetic Identity / KYC Registry',
        recordId: `KYC-UIDAI-${suffix}`,
        attributeType: 'DOB',
        attributeLabel: 'Date of Birth',
        attributeValue: '1984-07-14',
        maskedValue: '14 Jul 1984',
        firstSeen: '2023-04-12',
        lastSeen: '2026-06-10',
        verificationStatus: 'VERIFIED_SOURCE',
        confidenceScore: 0.98
      },
      {
        id: `REC_${suffix}_03`,
        sourceType: 'TELECOM_CDR',
        sourceName: 'Synthetic Telecom Records',
        recordId: `CDR_LOG_${suffix}`,
        attributeType: 'PHONE',
        attributeLabel: 'Primary MSISDN',
        attributeValue: '+91 XXXXX 28471',
        maskedValue: '+91 XXXXX 28471',
        firstSeen: '2024-02-18',
        lastSeen: 'Today, 14:15 UTC',
        verificationStatus: 'VERIFIED_SOURCE',
        confidenceScore: 0.96
      },
      {
        id: `REC_${suffix}_04`,
        sourceType: 'BANKING_CORE',
        sourceName: 'Synthetic Banking Records',
        recordId: `BANK_ACCT_${suffix}`,
        attributeType: 'ACCOUNT',
        attributeLabel: 'Commercial Ledger Account',
        attributeValue: 'XXXX XXXX 4821',
        maskedValue: 'XXXX XXXX 4821',
        firstSeen: '2025-01-10',
        lastSeen: 'Today, 14:32 UTC',
        verificationStatus: 'VERIFIED_SOURCE',
        confidenceScore: 0.95
      },
      {
        id: `REC_${suffix}_05`,
        sourceType: 'VEHICLE_ANPR',
        sourceName: 'Synthetic Vehicle / ANPR Records',
        recordId: `ANPR_TOLL_${suffix}`,
        attributeType: 'VEHICLE',
        attributeLabel: 'Registered Transport Asset',
        attributeValue: 'MH-04-XX-2847',
        maskedValue: 'MH-04-XX-2847',
        firstSeen: '2025-08-04',
        lastSeen: 'Today, 07:10 UTC',
        verificationStatus: 'VERIFIED_SOURCE',
        confidenceScore: 0.92
      },
      {
        id: `REC_${suffix}_06`,
        sourceType: 'INCIDENT_FIR',
        sourceName: 'Synthetic Incident / FIR Records',
        recordId: 'FIR_POLICE_019',
        attributeType: 'ALIAS',
        attributeLabel: 'Reported Field Alias',
        attributeValue: 'Ravi (R. Sharma)',
        maskedValue: 'Ravi (R. Sharma)',
        firstSeen: '2026-05-18',
        lastSeen: '2026-07-22',
        verificationStatus: 'REPORTED_ALIAS',
        confidenceScore: 0.88
      },
      {
        id: `REC_${suffix}_07`,
        sourceType: 'ROC_CORPORATE',
        sourceName: 'Synthetic Corporate Registry (ROC)',
        recordId: 'ROC_CORP_0019',
        attributeType: 'ORGANIZATION',
        attributeLabel: 'Director / Signatory Affiliation',
        attributeValue: 'Meridian Logistics Pvt. Ltd.',
        maskedValue: 'Meridian Logistics Pvt. Ltd.',
        firstSeen: '2024-11-05',
        lastSeen: '2026-08-01',
        verificationStatus: 'VERIFIED_SOURCE',
        confidenceScore: 0.94
      }
    ];

    // 2. Identity Aliases Matrix
    const aliases: IdentityAliasRecord[] = [
      {
        id: `AL_${suffix}_01`,
        aliasName: entityId === 'Person_044' ? 'Rahul Sharma' : `${entityId} Registered Name`,
        aliasType: 'PRIMARY_LEGAL_NAME',
        sourceName: 'Synthetic Identity Registry',
        sourceRecordId: `KYC-UIDAI-${suffix}`,
        firstSeen: '2023-04-12',
        lastSeen: '2026-06-10',
        verificationStatus: 'Verified in Source Dataset',
        notes: 'Primary legal identity matching KYC documents.'
      },
      {
        id: `AL_${suffix}_02`,
        aliasName: 'R. Sharma',
        aliasType: 'REPORTED_ALIAS',
        sourceName: 'Synthetic Incident / FIR Records',
        sourceRecordId: 'FIR_POLICE_019',
        firstSeen: '2026-05-18',
        lastSeen: '2026-07-22',
        verificationStatus: 'Reported in Incident FIR',
        notes: 'Informant statement citation; consistent with primary identity.'
      },
      {
        id: `AL_${suffix}_03`,
        aliasName: 'Ravi (Logistics Operator)',
        aliasType: 'SOURCE_RECORD_ALIAS',
        sourceName: 'Synthetic Telecom Records',
        sourceRecordId: `CDR_LOG_${suffix}`,
        firstSeen: '2026-06-01',
        lastSeen: '2026-08-25',
        verificationStatus: 'Source-Record Telecom Tag',
        notes: 'Internal telecommunication network node label.'
      }
    ];

    // 3. Identity Conflicts
    let rawConflicts: IdentityConflict[] = [
      {
        id: `CONF_${suffix}_01`,
        entityId,
        title: 'Spelling Variance across Cross-Source Records',
        conflictType: 'NAME_SPELLING_VARIANCE',
        sourceA: {
          sourceName: 'Synthetic Identity Registry',
          recordId: `KYC-UIDAI-${suffix}`,
          value: 'Rahul Sharma',
          timestamp: '2023-04-12'
        },
        sourceB: {
          sourceName: 'Synthetic Incident / FIR Records',
          recordId: 'FIR_POLICE_042',
          value: 'Rahul S. Sharma',
          timestamp: '2026-06-14'
        },
        inconsistencyExplanation: 'Name variance detected between formal KYC registry and field incident complaint filing.',
        status: 'REQUIRES_INVESTIGATOR_REVIEW'
      }
    ];

    // Load overrides from local storage
    try {
      const storedConflicts = localStorage.getItem(STORAGE_KEY_CONFLICTS);
      if (storedConflicts) {
        const parsed = JSON.parse(storedConflicts);
        rawConflicts = rawConflicts.map(c => {
          const found = parsed.find((p: any) => p.id === c.id);
          return found ? { ...c, ...found } : c;
        });
      }
    } catch {}

    // 4. Potential Duplicate Entities
    let rawDuplicates: PotentialDuplicateEntity[] = [
      {
        id: `DUP_${suffix}_01`,
        primaryEntityId: entityId,
        candidateEntityId: 'Person_117',
        candidateName: 'Rahul S. (Logistics Agent)',
        matchScore: 84,
        matchTier: 'POSSIBLE_MATCH',
        whyMatchedReasons: [
          'Shared telecommunication cell tower handover location near Vashi Safehouse.',
          'Common corporate affiliation with Meridian Logistics Pvt. Ltd.',
          'Temporal co-location observed on 12 Aug 2026.'
        ],
        overlappingAttributes: {
          phones: ['+91 XXXXX 28471'],
          accounts: ['XXXX XXXX 4821'],
          addresses: ['Thane West Logistics Hub'],
          organizations: ['Meridian Logistics Pvt. Ltd.']
        },
        sourceRecords: ['CDR_00441', 'ROC_CORP_0019', 'ANPR_00881'],
        status: 'PENDING_REVIEW'
      }
    ];

    try {
      const storedDuplicates = localStorage.getItem(STORAGE_KEY_DUPLICATES);
      if (storedDuplicates) {
        const parsed = JSON.parse(storedDuplicates);
        rawDuplicates = rawDuplicates.map(d => {
          const found = parsed.find((p: any) => p.id === d.id);
          return found ? { ...d, ...found } : d;
        });
      }
    } catch {}

    // 5. Identity Evolution Timeline
    const evolutionTimeline: IdentityEvolutionStep[] = [
      {
        id: 'EVO_01',
        year: '2023',
        date: '12 Apr 2023',
        eventType: 'KYC_REGISTRATION',
        summary: 'Primary Identity KYC Registered',
        details: 'Initial digital identity and demographic verification recorded.',
        sourceName: 'Synthetic Identity Registry',
        recordId: `KYC-UIDAI-${suffix}`
      },
      {
        id: 'EVO_02',
        year: '2024',
        date: '18 Feb 2024',
        eventType: 'TELECOM_ACTIVATION',
        summary: 'Primary Telecom MSISDN Handshake',
        details: 'Cellular line +91 XXXXX 28471 activated with VoLTE carrier.',
        sourceName: 'Synthetic Telecom Records',
        recordId: `CDR_LOG_${suffix}`
      },
      {
        id: 'EVO_03',
        year: '2024',
        date: '05 Nov 2024',
        eventType: 'CORPORATE_FILING',
        summary: 'Corporate Director Registry Filing',
        details: 'Listed as operational signatory for Meridian Logistics Pvt. Ltd.',
        sourceName: 'Synthetic Corporate Registry (ROC)',
        recordId: 'ROC_CORP_0019'
      },
      {
        id: 'EVO_04',
        year: '2025',
        date: '10 Jan 2025',
        eventType: 'BANK_OPENING',
        summary: 'Commercial Bank Ledger Opened',
        details: 'Account ending 4821 initialized for trade settlements.',
        sourceName: 'Synthetic Banking Records',
        recordId: `BANK_ACCT_${suffix}`
      },
      {
        id: 'EVO_05',
        year: '2026',
        date: '18 May 2026',
        eventType: 'INCIDENT_RECORDED',
        summary: 'Alias Logged in Cross-Border Incident Report',
        details: 'Alias "R. Sharma" noted in cross-agency intelligence report.',
        sourceName: 'Synthetic Incident / FIR Records',
        recordId: 'FIR_POLICE_019'
      }
    ];

    const hasPendingConflicts = rawConflicts.some(c => c.status === 'REQUIRES_INVESTIGATOR_REVIEW');
    const resolutionStatus = hasPendingConflicts ? 'CONFLICTS_PENDING' : 'UNIFIED_CONFIRMED';
    const resolutionScore = hasPendingConflicts ? 78 : 94;

    return {
      entityId,
      primaryLegalName: entityId === 'Person_044' ? 'Rahul Sharma' : `${entityId} Registered Name`,
      resolutionScore,
      resolutionStatus,
      sourceRecords,
      aliases,
      conflicts: rawConflicts,
      potentialDuplicates: rawDuplicates,
      evolutionTimeline
    };
  },

  resolveConflict(
    conflictId: string, 
    decision: 'SAME_ENTITY' | 'KEEP_SEPARATE', 
    notes: string = '', 
    investigatorName: string = 'Inspector Rajesh Verma'
  ): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONFLICTS);
      const list = stored ? JSON.parse(stored) : [];
      const updatedItem = {
        id: conflictId,
        status: decision === 'SAME_ENTITY' ? 'RESOLVED_SAME_ENTITY' : 'RESOLVED_KEEP_SEPARATE',
        resolvedBy: investigatorName,
        resolvedAt: new Date().toISOString(),
        resolutionNotes: notes || `Investigator marked as ${decision === 'SAME_ENTITY' ? 'Same Unified Entity' : 'Distinct Entities'}.`
      };

      const existingIdx = list.findIndex((c: any) => c.id === conflictId);
      if (existingIdx >= 0) {
        list[existingIdx] = updatedItem;
      } else {
        list.push(updatedItem);
      }
      localStorage.setItem(STORAGE_KEY_CONFLICTS, JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to persist conflict resolution:', err);
    }
  },

  resolveDuplicateCandidate(
    duplicateId: string, 
    decision: 'MERGE' | 'SEPARATE', 
    notes: string = '', 
    investigatorName: string = 'Inspector Rajesh Verma'
  ): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DUPLICATES);
      const list = stored ? JSON.parse(stored) : [];
      const updatedItem = {
        id: duplicateId,
        status: decision === 'MERGE' ? 'CONFIRMED_MERGE' : 'CONFIRMED_SEPARATE',
        resolvedBy: investigatorName,
        resolvedAt: new Date().toISOString(),
        resolutionNotes: notes || `Investigator decision: ${decision === 'MERGE' ? 'Merged into Unified Entity' : 'Maintained as Separate Distinct Entities'}.`
      };

      const existingIdx = list.findIndex((d: any) => d.id === duplicateId);
      if (existingIdx >= 0) {
        list[existingIdx] = updatedItem;
      } else {
        list.push(updatedItem);
      }
      localStorage.setItem(STORAGE_KEY_DUPLICATES, JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to persist duplicate candidate decision:', err);
    }
  }
};
