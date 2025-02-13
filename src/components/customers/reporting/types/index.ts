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

export interface ReportDataSource {
  id: string;
  name: string;
  description?: string;
  query_template: string;
  parameters: any[];
  created_at: string;
  updated_at: string;
}

export interface ReportLayout {
  id: string;
  template_id: string;
  name: string;
  layout_config: Record<string, any>;
  page_settings: {
    size: string;
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  header_template?: string;
  footer_template?: string;
}

export interface ReportGenerationJob {
  id: string;
  template_id: string;
  schedule_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  parameters: Record<string, any>;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  output_url?: string;
  output_size?: number;
  processing_stats: Record<string, any>;
  created_at: string;
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
  data_source_id?: string;
  layout_id?: string;
  last_generated_at?: string;
  total_generations?: number;
  generation_settings?: Record<string, any>;
}
