import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoBanner } from './DemoBanner';
import { GlobalSearchModal } from './GlobalSearchModal';
import { DataIngestionModal } from '../ingestion/DataIngestionModal';
import { LoginModal } from '../auth/LoginModal';
import { CreateCaseModal } from '../cases/CreateCaseModal';
import { useInvestigation } from '../../context/InvestigationContext';
import { Overview } from '../../pages/Overview';
import { Cases } from '../../pages/Cases';
import { CaseDetails } from '../../pages/CaseDetails';
import { NetworkAnalysis } from '../../pages/NetworkAnalysis';
import { Entities } from '../../pages/Entities';
import { Timeline } from '../../pages/Timeline';
import { Alerts } from '../../pages/Alerts';
import { Reports } from '../../pages/Reports';
import { Audit } from '../../pages/Audit';

export const AppLayout: React.FC = () => {
  const { currentPage, isPresentationMode } = useInvestigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <Overview />;
      case 'cases': return <Cases />;
      case 'case-details': return <CaseDetails />;
      case 'network': return <NetworkAnalysis />;
      case 'entities': return <Entities />;
      case 'timeline': return <Timeline />;
      case 'alerts': return <Alerts />;
      case 'reports': return <Reports />;
      case 'audit': return <Audit />;
      default: return <Overview />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060a12] text-slate-100 antialiased font-sans">
      {/* Collapsible Sidebar (Hidden in Presentation Mode for max screen estate) */}
      {!isPresentationMode && <Sidebar />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Demo Environment Top Banner */}
        <DemoBanner />

        {/* Global Header */}
        <Header />

        {/* Dynamic Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#060a12]">
          <div className={`${isPresentationMode ? 'max-w-full px-2' : 'max-w-7xl'} mx-auto space-y-6`}>
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
