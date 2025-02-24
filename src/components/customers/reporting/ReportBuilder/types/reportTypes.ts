
export type ReportType = 'tabular' | 'summary' | 'chart';

export interface ReportField {
  name: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'currency' | 'percentage' | 'email' | 'phone' | 'url';
  format?: string;
  aggregate?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median' | 'mode';
}

export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between' | 'in' | 'startsWith' | 'endsWith' | 
            'notEquals' | 'notContains' | 'gte' | 'lte' | 'isNull' | 'isNotNull' | 'regex';
  value: any;
}

export interface ReportTemplate {
  id?: string;
  name: string;
  description?: string;
  type: ReportType;
  fields: ReportField[];
  filters: ReportFilter[];
  sortOptions: Array<{field: string; direction: 'asc' | 'desc'}>;
  config?: {
    chartType?: string;
    xAxis?: string;
    yAxis?: string;
    layout?: string;
  };
  organization_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReportSchedule {
  id?: string;
  template_id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: Array<{
    email: string;
    type: 'to' | 'cc' | 'bcc';
  }>;
  status: 'active' | 'paused' | 'pending_approval';
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  organization_id?: string;
  last_run?: string;
  next_run?: string;
}

export interface ReportGenerationJob {
  id: string;
  template_id: string;
  schedule_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_by: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  output_url?: string;
  output_size?: number;
  error_message?: string;
  processing_stats: Record<string, any>;
  parameters: Record<string, any>;
  organization_id: string;
}

export interface ReportOutput {
  id: string;
  template_id: string;
  schedule_id?: string;
  name: string;
  file_type: string;
  file_url: string;
  file_path?: string;
  file_size?: number;
  status: string;
  created_by: string;
  created_at: string;
  metadata: Record<string, any>;
  organization_id: string;
  sort_options?: Array<{field: string; direction: 'asc' | 'desc'}>;
}
