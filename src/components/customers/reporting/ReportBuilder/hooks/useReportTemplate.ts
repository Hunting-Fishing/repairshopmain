
import { useState } from 'react';
import type { ReportTemplate } from '../types/reportTypes';

export function useReportTemplate() {
  const [template, setTemplate] = useState<Partial<ReportTemplate>>({
    type: 'tabular',
    fields: [],
    filters: [],
    sortOptions: []
  });

  const updateTemplate = (updates: Partial<ReportTemplate>) => {
    setTemplate(prev => ({ ...prev, ...updates }));
  };

  const resetTemplate = () => {
    setTemplate({
      type: 'tabular',
      fields: [],
      filters: [],
      sortOptions: []
    });
  };

  return {
    template,
    updateTemplate,
    resetTemplate
  };
}
