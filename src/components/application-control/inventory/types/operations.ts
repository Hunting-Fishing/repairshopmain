
// Batch operations and notifications
export type InventoryBatchOperation = {
  id: string;
  organization_id: string;
  created_by: string;
  operation_type: 'delete' | 'archive' | 'export';
  items: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  error_message?: string;
  metadata: Record<string, any>;
};

export type InventoryNotification = {
  id: string;
  organization_id: string;
  inventory_item_id?: string;
  message: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'reorder' | 'price_change';
  priority: 'low' | 'normal' | 'high';
  status: 'unread' | 'read';
  created_at: string;
  read_at?: string;
  threshold_value?: number;
  current_value?: number;
  metadata: Record<string, any>;
};
