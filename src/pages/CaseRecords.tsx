import React, { useState } from 'react';
import { CaseRecordsList } from '../components/records/CaseRecordsList';
import { CaseRecordDetailView } from '../components/records/CaseRecordDetailView';
import { useInvestigation } from '../context/InvestigationContext';

export const CaseRecords: React.FC = () => {
  const { activeCaseId } = useInvestigation();
  const [selectedRecordCaseId, setSelectedRecordCaseId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {selectedRecordCaseId ? (
        <CaseRecordDetailView
          caseId={selectedRecordCaseId}
          onBack={() => setSelectedRecordCaseId(null)}
        />
      ) : (
        <CaseRecordsList
          onSelectCase={(caseId) => setSelectedRecordCaseId(caseId)}
        />
      )}
    </div>
  );
};
