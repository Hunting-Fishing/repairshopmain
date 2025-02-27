
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PerformanceReportsDialog } from './PerformanceReportsDialog';

export function PerformanceReportsWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <Button 
        onClick={() => setIsOpen(true)}
        className="mb-4"
      >
        View Performance Reports
      </Button>
      
      <PerformanceReportsDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
      >
        <div className="grid gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Performance Overview</h3>
            <p>This is a placeholder for performance data visualization.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-2">Metrics</h3>
            <p>Key performance indicators will be displayed here.</p>
          </div>
        </div>
      </PerformanceReportsDialog>
    </div>
  );
}
