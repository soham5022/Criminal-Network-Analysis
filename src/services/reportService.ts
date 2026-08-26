import { IntelligenceReport } from '../types';
import { mockInvestigationReports } from '../data/mockReports';

export const reportService = {
  async getReports(caseId?: string): Promise<IntelligenceReport[]> {
    if (caseId) {
      return mockInvestigationReports.filter(r => r.caseId === caseId);
    }
    return [...mockInvestigationReports];
  },

  async getReportById(id: string): Promise<IntelligenceReport | undefined> {
    return mockInvestigationReports.find(r => r.id === id);
  },

  async generateMockReport(caseId: string): Promise<IntelligenceReport> {
    const existing = mockInvestigationReports.find(r => r.caseId === caseId);
    if (existing) return existing;
    return mockInvestigationReports[0];
  }
};
