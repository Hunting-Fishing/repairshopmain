
import React, { ReactNode } from 'react';
import { PerformanceReports } from '../PerformanceReports';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80%] max-h-[90vh] overflow-auto">
        {/* Wrap children in a single element to fix the TypeScript error */}
        <div className="performance-reports-content">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
