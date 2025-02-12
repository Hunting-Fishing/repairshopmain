
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
