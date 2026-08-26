import { IngestionDataset } from '../types';

export const mockDatasets: IngestionDataset[] = [
  {
    id: 'DS-2026-FIR-09',
    name: 'Metropolitan Inter-State FIR Dump (Vol 4)',
    type: 'FIR',
    fileSize: '14.2 MB',
    recordCount: 1247,
    estimatedEntities: 480,
    estimatedRelationships: 1120,
    uploadedAt: '26 Aug 2026, 17:05',
    status: 'COMPLETED'
  },
  {
    id: 'DS-2026-CDR-14',
    name: 'Sector 14 & 18 Tower Call Detail Records (CDR)',
    type: 'CDR',
    fileSize: '88.5 MB',
    recordCount: 5842,
    estimatedEntities: 1247,
    estimatedRelationships: 3842,
    uploadedAt: '26 Aug 2026, 17:40',
    status: 'PENDING'
  },
  {
    id: 'DS-2026-BNK-88',
    name: 'Commercial Bank Swift & RTGS Transaction Stream',
    type: 'FINANCIAL',
    fileSize: '32.1 MB',
    recordCount: 3190,
    estimatedEntities: 310,
    estimatedRelationships: 840,
    uploadedAt: '26 Aug 2026, 18:10',
    status: 'PENDING'
  },
  {
    id: 'DS-2026-ANPR-02',
    name: 'Northern Highway Toll & CCTV ANPR Captures',
    type: 'INCIDENT',
    fileSize: '41.8 MB',
    recordCount: 2480,
    estimatedEntities: 290,
    estimatedRelationships: 610,
    uploadedAt: '26 Aug 2026, 18:22',
    status: 'PENDING'
  }
];

export const ingestionService = {
  async getDatasets(): Promise<IngestionDataset[]> {
    return [...mockDatasets];
  },

  async simulateAnalysisPipeline(
    datasetId: string, 
    onProgress: (stage: string, percent: number) => void
  ): Promise<{ success: boolean; extractedEntities: number; extractedRelationships: number }> {
    const stages = [
      { name: '1/4 Parsing Raw Documents & Call Records...', percent: 25, delay: 600 },
      { name: '2/4 Entity Resolution & Alias Deduplication...', percent: 55, delay: 700 },
      { name: '3/4 Constructing Knowledge Graph & CoSE Layout...', percent: 80, delay: 600 },
      { name: '4/4 Evaluating Anomaly Rules & Multi-Cluster Bridges...', percent: 100, delay: 500 }
    ];

    for (const stage of stages) {
      await new Promise(res => setTimeout(res, stage.delay));
      onProgress(stage.name, stage.percent);
    }

    const ds = mockDatasets.find(d => d.id === datasetId);
    if (ds) ds.status = 'COMPLETED';

    return {
      success: true,
      extractedEntities: 1247,
      extractedRelationships: 3842
    };
  }
};
