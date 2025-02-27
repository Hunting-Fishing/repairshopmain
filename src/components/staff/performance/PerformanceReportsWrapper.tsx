
import React from 'react';
import PerformanceReports from '../PerformanceReports';

export function PerformanceReportsWrapper() {
  // This component acts as a wrapper to fix the children prop error
  // by providing a single child to PerformanceReports
  return (
    <div className="w-full">
      <PerformanceReports>
        <div className="performance-reports-content">
          {/* Wrap all content in a single div to satisfy the single child requirement */}
          <div className="grid gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Performance Overview</h3>
              <p>This is a placeholder for performance data visualization.</p>
            </div>
          </div>
        </div>
      </PerformanceReports>
    </div>
  );
}
