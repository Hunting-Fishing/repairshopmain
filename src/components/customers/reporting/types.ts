
export interface ReportSchedule {
  id?: string;
  templateId: string;
  name?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: Array<{ email: string; type: 'to' | 'cc' | 'bcc' }>;
}

export interface ReportProcessingQueueItem {
  id: string;
  template_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  organization_id: string;
}

export interface RealtimePostgresChangesPayload<T = any> {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T | null;
  errors: null | any[];
}
