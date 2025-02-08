
// Supplier-specific types
export interface SupplierAutomationSettings {
  reorder_threshold: number;
  payment_reminder_days: number;
  contract_reminder_days: number;
  notification_preferences: {
    email: boolean;
    in_app: boolean;
  };
  auto_reorder: boolean;
  min_stock_threshold: number;
  preferred_delivery_days: string[];
  auto_payment: boolean;
}

export interface SupplierMessage {
  id: string;
  message_type: string;
  message_content: string;
  created_at: string;
  status: string;
  priority: string;
  category: string;
  response_required: boolean;
  due_date?: string;
}

export interface SupplierDocument {
  id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
  status: string;
  notes?: string;
}

export interface SupplierTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
}
