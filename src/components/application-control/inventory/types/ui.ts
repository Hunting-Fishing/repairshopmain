
import type { InventoryItem } from "./base";

// UI specific types
export interface InventoryFilter {
  category?: string;
  supplier?: string;
  lowStock?: boolean;
  search?: string;
}

export interface InventorySort {
  field: keyof InventoryItem;
  direction: 'asc' | 'desc';
}

export interface InventoryItemWithCategory extends InventoryItem {
  category?: {
    name: string | null;
  } | null;
}

// Error and Response types
export interface InventoryError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface InventoryResponse<T> {
  data: T | null;
  error: InventoryError | null;
  isLoading: boolean;
}
