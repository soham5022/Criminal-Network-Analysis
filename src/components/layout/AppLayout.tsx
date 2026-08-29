import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoBanner } from './DemoBanner';
import { GlobalSearchModal } from './GlobalSearchModal';
import { DataIngestionModal } from '../ingestion/DataIngestionModal';
import { LoginModal } from '../auth/LoginModal';
import { CreateCaseModal } from '../cases/CreateCaseModal';
import { useInvestigation } from '../../context/InvestigationContext';
import { LandingPage } from '../../pages/LandingPage';
import { LoginPage } from '../../pages/LoginPage';
import { Overview } from '../../pages/Overview';
import { Cases } from '../../pages/Cases';
import { CaseDetails } from '../../pages/CaseDetails';
import { CaseRecords } from '../../pages/CaseRecords';
import { NetworkAnalysis } from '../../pages/NetworkAnalysis';
import { Entities } from '../../pages/Entities';
import { Timeline } from '../../pages/Timeline';
import { Alerts } from '../../pages/Alerts';
import { Reports } from '../../pages/Reports';
import { Settings } from '../../pages/Settings';
import { Audit } from '../../pages/Audit';
import { CaseEvidenceTab } from '../cases/CaseEvidenceTab';

export const AppLayout: React.FC = () => {
  const { currentPage, activeCaseId, isPresentationMode } = useInvestigation();

  if (currentPage === 'landing') {
    return <LandingPage />;
  }

  if (currentPage === 'login') {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
      case 'overview': 
        return <Overview />;
      case 'cases': 
        return <Cases />;
      case 'case-records':
        return <CaseRecords />;
      case 'case-details': 
        return <CaseDetails />;
      case 'entities':
        return <Entities />;
      case 'network':
      case 'investigate':
        return <NetworkAnalysis />;
      case 'alerts': 
        return <Alerts />;
      case 'timeline':
        return <Timeline />;
      case 'evidence':
        return <CaseEvidenceTab caseId={activeCaseId} />;
      case 'reports': 
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'audit': 
        return <Audit />;
      default: 
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090e17] text-slate-100 antialiased font-sans">
      {/* Sidebar Navigation */}
      {!isPresentationMode && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Demo Environment Top Banner */}
        <DemoBanner />

        {/* Global Header */}
        <Header />

        {/* Dynamic Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 bg-[#090e17]">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <DataIngestionModal />
      <LoginModal />
      <CreateCaseModal />
    </div>
  );
};

