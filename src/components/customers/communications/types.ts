
export interface Customer {
  id: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  email?: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'docusign' | 'notification';
  content: string;
  sent_at: string;
  status: 'delivered' | 'failed' | 'pending';
  sender?: {
    first_name: string;
    last_name: string;
  };
  metadata?: Record<string, any>;
}

export interface CommunicationsFilter {
  type?: Communication['type'];
  status?: Communication['status'];
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface CommunicationSort {
  field: 'sent_at' | 'type' | 'status';
  direction: 'asc' | 'desc';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category_id?: string;
  status: 'draft' | 'active' | 'archived';
  is_default: boolean;
  created_at: string;
  updated_at: string;
  organization_id: string;
  notification_settings: {
    notify_on_send: boolean;
    notify_on_error: boolean;
  };
  notification_recipients: any[]; // Changed to match JSONB database type
}

export interface EmailTemplateVersion {
  id: string;
  template_id: string;
  version: number;
  content: string;
  subject: string;
  variables: string[];
  changes_description?: string;
  created_at: string;
  created_by: string;
  organization_id: string;
}

export interface TemplateVariable {
  name: string;
  description: string;
  example: string;
}

export interface EmailTemplateCategory {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}
