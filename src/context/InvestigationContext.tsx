import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EntityType, AnalyticalPriority } from '../types';

export type AppPage = 
  | 'dashboard' 
  | 'overview' 
  | 'cases' 
  | 'case-details' 
  | 'investigate' 
  | 'network' 
  | 'entities' 
  | 'timeline' 
  | 'alerts' 
  | 'reports'
  | 'audit';

export type CaseWorkspaceTab = 
  | 'overview' 
  | 'investigation' 
  | 'network'
  | 'entities'
  | 'timeline'
  | 'alerts' 
  | 'evidence' 
  | 'reports' 
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
  activeEntityFilter: {
    type?: EntityType;
    priority?: AnalyticalPriority;
    community?: string;
  };
  navigateTo: (page: AppPage, options?: { 
    caseId?: string; 
    entityId?: string; 
    alertId?: string; 
    tab?: CaseWorkspaceTab 
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
  const [activeEntityFilter, setActiveEntityFilter] = useState<{
    type?: EntityType;
    priority?: AnalyticalPriority;
    community?: string;
  }>({});

  const navigateTo = (page: AppPage, options?: { 
    caseId?: string; 
    entityId?: string; 
    alertId?: string;
    tab?: CaseWorkspaceTab;
  }) => {
    if (options?.caseId) setActiveCaseId(options.caseId);
    if (options?.entityId !== undefined) setSelectedEntityId(options.entityId);
    if (options?.alertId !== undefined) setSelectedAlertId(options.alertId);
    if (options?.tab) setActiveCaseTab(options.tab);
    
    // Normalize aliases
    if (page === 'overview') {
      setCurrentPage('dashboard');
    } else if (page === 'network') {
      setCurrentPage('investigate');
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
