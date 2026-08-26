import React from 'react';
import { AlertsList } from '../components/alerts/AlertsList';

export const Alerts: React.FC = () => {
  return (
    <div className="space-y-6">
      <AlertsList />
    </div>
  );
};
