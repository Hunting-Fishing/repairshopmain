
export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'docusign' | 'notification';
  content: string;
  sent_at: string;
  status?: 'delivered' | 'failed' | 'pending';
  sender?: {
    first_name: string;
    last_name: string;
  };
}

export interface Customer {
  id: string;
  phone_number?: string;
  first_name: string;
  last_name: string;
  email?: string;
}
