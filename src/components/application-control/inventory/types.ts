export interface Category {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}