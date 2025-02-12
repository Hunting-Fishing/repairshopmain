
export type ReportType = 'tabular' | 'summary' | 'chart';

export interface ReportField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  format?: string;
  aggregate?: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between' | 'in';
  value: any;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  fields: ReportField[];
  filters: ReportFilter[];
  sortOptions: Array<{field: string; direction: 'asc' | 'desc'}>;
  config: Record<string, any>;
}

export interface ReportSchedule {
  id: string;
  templateId: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: Array<{email: string; type: 'to' | 'cc' | 'bcc'}>;
  nextRun?: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'error';
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'list' | 'table';
  title: string;
  config: Record<string, any>;
  position: {x: number; y: number; w: number; h: number};
}

export interface DashboardConfig {
  id: string;
  name: string;
  description?: string;
  layout: DashboardWidget[];
  isDefault: boolean;
}
