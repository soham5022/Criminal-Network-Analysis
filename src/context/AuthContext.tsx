import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User, UserRole } from '../services/authService';
import { auditService } from '../services/auditService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  isAdmin: boolean;
  isInvestigator: boolean;
  isViewer: boolean;
  canEdit: boolean;
  canIngest: boolean;
  canViewAudit: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsInvestigator: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  loginAsViewer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = authService.getUser();
    if (saved) return saved;
    // Default seeded investigator for quick exploration
    return {
      id: 'USR-INT-8902',
      email: 'rajesh.verma@mha.gov.in',
      name: 'Inspector Rajesh Verma',
      role: 'INVESTIGATOR',
      badge_number: 'MHA-INT-8902',
      department: 'Special Cyber & Financial Crimes Division',
      is_active: true
    };
  });

  const isAuthenticated = !!user;
  const role: UserRole = user?.role || 'INVESTIGATOR';

  const isAdmin = role === 'ADMIN';
  const isInvestigator = role === 'INVESTIGATOR' || isAdmin;
  const isViewer = role === 'VIEWER';

  const canEdit = isInvestigator || isAdmin;
  const canIngest = isInvestigator || isAdmin;
  const canViewAudit = isAdmin || isInvestigator;

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      auditService.logAction({
        action: 'LOGIN',
        actionLabel: 'User Authentication Successful',
        module: 'Authentication',
        status: 'SUCCESS',
        details: `User ${res.user.name} (${res.user.role}) authenticated via official credentials.`,
        user: res.user
      });
    } catch (err: any) {
      auditService.logAction({
        action: 'FAILED_LOGIN',
        actionLabel: 'Failed Authentication Attempt',
        module: 'Authentication',
        status: 'FAILED',
        details: `Failed authentication attempt for email ${email}.`
      });
      throw err;
    }
  };

  const logout = () => {
    if (user) {
      auditService.logAction({
        action: 'LOGOUT',
        actionLabel: 'User Signed Out of Session',
        module: 'Authentication',
        status: 'SUCCESS',
        details: `User ${user.name} (${user.role}) signed out.`,
        user
      });
    }
    authService.clearSession();
    setUser(null);
  };

  const loginAsInvestigator = async () => {
    await login('rajesh.verma@mha.gov.in', 'Investigator@2026!');
  };

  const loginAsAdmin = async () => {
    await login('admin@mha.gov.in', 'Admin@MHA2026!');
  };

  const loginAsViewer = async () => {
    await login('viewer@mha.gov.in', 'Viewer@2026!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role,
        isAdmin,
        isInvestigator,
        isViewer,
        canEdit,
        canIngest,
        canViewAudit,
        login,
        logout,
        loginAsInvestigator,
        loginAsAdmin,
        loginAsViewer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
