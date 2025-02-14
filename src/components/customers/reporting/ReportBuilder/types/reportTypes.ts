
export type ReportType = 'tabular' | 'summary' | 'chart';

export interface ReportTemplate {
  id?: string;
  name: string;
  type: ReportType;
  fields: string[];
  filters: any[];
  sortOptions: any[];
  config?: {
    chartType: string;
    xAxis: string;
    yAxis: string;
  };
}
