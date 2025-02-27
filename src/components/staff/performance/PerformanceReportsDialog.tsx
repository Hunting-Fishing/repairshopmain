
import React, { ReactNode } from 'react';
import { PerformanceReports } from '../PerformanceReports';

interface PerformanceReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function PerformanceReportsDialog({ 
  isOpen, 
  onClose, 
  children 
}: PerformanceReportsDialogProps) {
  return (
    <PerformanceReports isOpen={isOpen} onClose={onClose}>
      {/* Wrap children in a single div element to satisfy the type requirement */}
      <div className="performance-reports-content">
        {children}
      </div>
    </PerformanceReports>
  );
}
