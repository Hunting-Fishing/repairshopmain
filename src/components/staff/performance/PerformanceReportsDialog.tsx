
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Performance Reports</DialogTitle>
        </DialogHeader>
        <div className="performance-reports-content">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
