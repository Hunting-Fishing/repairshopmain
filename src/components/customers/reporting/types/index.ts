
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
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  fields: ReportField[];
  filters: ReportFilter[];
  sortOptions: Array<{field: string; direction: 'asc' | 'desc'}>;
  config: Record<string, any>;
}
