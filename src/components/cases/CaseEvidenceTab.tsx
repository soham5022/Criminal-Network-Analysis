import React from 'react';
import { EvidenceRegistryView } from '../evidence/EvidenceRegistryView';

export const CaseEvidenceTab: React.FC<{ caseId: string }> = ({ caseId }) => {
  return (
    <div className="w-full">
      <EvidenceRegistryView initialCaseId={caseId} />
    </div>
  );
};
