import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { InvestigationProvider } from './context/InvestigationContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <AuthProvider>
      <InvestigationProvider>
        <AppLayout />
      </InvestigationProvider>
    </AuthProvider>
  );
}

export default App;
