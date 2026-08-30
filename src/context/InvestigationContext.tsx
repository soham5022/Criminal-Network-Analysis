import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EntityType, AnalyticalPriority } from '../types';
import { auditService } from '../services/auditService';

export type AppPage = 
  | 'landing'
  | 'login'
  | 'dashboard' 
  | 'overview' 
  | 'cases' 
  | 'case-records'
  | 'case-details' 
  | 'entities' 
  | 'network' 
  | 'alerts' 
  | 'timeline' 
  | 'evidence' 
  | 'reports'
  | 'settings'
  | 'audit'
  | 'investigate';

export type CaseWorkspaceTab = 
  | 'overview' 
  | 'witnesses'
  | 'actions'
  | 'network'
  | 'entities'
  | 'timeline'
  | 'alerts' 
  | 'evidence' 
  | 'notes'
  | 'reports'
  | 'history'
  | 'investigation' 
  | 'activity';

interface InvestigationContextType {
  currentPage: AppPage;
  activeCaseId: string;
  selectedEntityId: string | null;
  selectedAlertId: string | null;
  activeCaseTab: CaseWorkspaceTab;
  searchQuery: string;
  isOmniSearchOpen: boolean;
  isIngestionModalOpen: boolean;
  isCreateCaseModalOpen: boolean;
  isLoginModalOpen: boolean;
  isPresentationMode: boolean;
  isEntityProfileOpen: boolean;
  activeEntityFilter: {
    type?: EntityType;
    priority?: AnalyticalPriority;
    community?: string;
  };
  navigateTo: (page: AppPage, options?: { 
    caseId?: string; 
    entityId?: string; 
    alertId?: string; 
    tab?: CaseWorkspaceTab;
    openProfile?: boolean;
  }) => void;
  setActiveCaseId: (caseId: string) => void;
  setSelectedEntityId: (entityId: string | null) => void;
  setSelectedAlertId: (alertId: string | null) => void;
  setActiveCaseTab: (tab: CaseWorkspaceTab) => void;
  setSearchQuery: (query: string) => void;
  setIsOmniSearchOpen: (open: boolean) => void;
  setIsIngestionModalOpen: (open: boolean) => void;
  setIsCreateCaseModalOpen: (open: boolean) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  setIsEntityProfileOpen: (open: boolean) => void;
  openEntityProfile: (entityId: string) => void;
  closeEntityProfile: () => void;
  togglePresentationMode: () => void;
  setEntityFilter: (filter: { type?: EntityType; priority?: AnalyticalPriority; community?: string }) => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');
  const [activeCaseId, setActiveCaseId] = useState<string>('CASE-1024');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('Person_044');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [activeCaseTab, setActiveCaseTab] = useState<CaseWorkspaceTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOmniSearchOpen, setIsOmniSearchOpen] = useState<boolean>(false);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState<boolean>(false);
  const [isCreateCaseModalOpen, setIsCreateCaseModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isEntityProfileOpen, setIsEntityProfileOpen] = useState<boolean>(false);
  const [activeEntityFilter, setActiveEntityFilter] = useState<{
    type?: EntityType;
    priority?: AnalyticalPriority;
    community?: string;
  }>({});

  const openEntityProfile = (entityId: string) => {
    setSelectedEntityId(entityId);
    setIsEntityProfileOpen(true);
    setCurrentPage('case-details');
    setActiveCaseTab('entities');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    auditService.logAction({
      action: 'VIEWED_ENTITY',
      actionLabel: 'Inspected 360° Entity Profile',
      module: 'Entities',
      caseId: activeCaseId,
      recordId: entityId,
      recordType: 'PERSON',
      recordLabel: entityId,
      status: 'SUCCESS',
      details: `Investigator opened 360° intelligence dossier for entity ${entityId}.`
    });
  };

  const closeEntityProfile = () => {
    setIsEntityProfileOpen(false);
  };

  const navigateTo = (page: AppPage, options?: { 
    caseId?: string; 
    entityId?: string; 
    alertId?: string;
    tab?: CaseWorkspaceTab;
    openProfile?: boolean;
  }) => {
    const targetCaseId = options?.caseId || activeCaseId;
    if (options?.caseId) setActiveCaseId(options.caseId);
    if (options?.entityId !== undefined) {
      setSelectedEntityId(options.entityId);
      if (options.openProfile) {
        setIsEntityProfileOpen(true);
      }
    }
    if (options?.alertId !== undefined) setSelectedAlertId(options.alertId);
    if (options?.tab) setActiveCaseTab(options.tab);
    
    // Normalize aliases
    if (page === 'overview') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Log key operational navigations
    if (page === 'case-details' || (page === 'cases' && options?.caseId)) {
      auditService.logAction({
        action: 'VIEWED_CASE',
        actionLabel: 'Opened Case Investigation Dossier',
        module: 'Cases',
        caseId: targetCaseId,
        recordId: targetCaseId,
        recordType: 'CASE',
        recordLabel: targetCaseId,
        status: 'SUCCESS',
        details: `Investigator accessed case dossier for ${targetCaseId}.`
      });
    } else if (page === 'evidence') {
      auditService.logAction({
        action: 'VIEWED_EVIDENCE',
        actionLabel: 'Accessed Digital Evidence Registry',
        module: 'Evidence',
        caseId: targetCaseId,
        status: 'SUCCESS',
        details: `Investigator accessed Digital Evidence Registry for ${targetCaseId}.`
      });
    } else if (page === 'network') {
      auditService.logAction({
        action: 'VIEWED_NETWORK',
        actionLabel: 'Opened Network Knowledge Graph',
        module: 'Network',
        caseId: targetCaseId,
        status: 'SUCCESS',
        details: `Investigator opened multi-source network analysis for ${targetCaseId}.`
      });
    } else if (page === 'reports') {
      auditService.logAction({
        action: 'VIEWED_REPORT',
        actionLabel: 'Accessed Case Intelligence Reports',
        module: 'Reports',
        caseId: targetCaseId,
        status: 'SUCCESS',
        details: `Investigator accessed case report generator for ${targetCaseId}.`
      });
    }
  };

  const togglePresentationMode = () => {
    setIsPresentationMode(prev => !prev);
  };

  return (
    <InvestigationContext.Provider
      value={{
        currentPage,
        activeCaseId,
        selectedEntityId,
        selectedAlertId,
        activeCaseTab,
        searchQuery,
        isOmniSearchOpen,
        isIngestionModalOpen,
        isCreateCaseModalOpen,
        isLoginModalOpen,
        isPresentationMode,
        isEntityProfileOpen,
        activeEntityFilter,
        navigateTo,
        setActiveCaseId,
        setSelectedEntityId,
        setSelectedAlertId,
        setActiveCaseTab,
        setSearchQuery,
        setIsOmniSearchOpen,
        setIsIngestionModalOpen,
        setIsCreateCaseModalOpen,
        setIsLoginModalOpen,
        setIsEntityProfileOpen,
        openEntityProfile,
        closeEntityProfile,
        togglePresentationMode,
        setEntityFilter: setActiveEntityFilter
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = (): InvestigationContextType => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
