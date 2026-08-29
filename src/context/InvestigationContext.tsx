import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EntityType, AnalyticalPriority } from '../types';

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
  | 'network'
  | 'entities'
  | 'timeline'
  | 'alerts' 
  | 'evidence' 
  | 'notes'
  | 'reports'
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
