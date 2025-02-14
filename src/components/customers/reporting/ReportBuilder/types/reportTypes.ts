
export type ReportTabType = 'fields' | 'filters' | 'sort' | 'preview';

export interface ReportConfig {
  chartType: 'bar' | 'line' | 'pie';
  xAxis: string;
  yAxis: string;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  recipients: string[];
}

export type { ReportTemplate, ReportType, ReportField, ReportFilter } from '@/components/customers/reporting/types';
