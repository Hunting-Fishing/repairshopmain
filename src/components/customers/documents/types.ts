
export interface DocumentCategory {
  id: string;
  parent_id: string | null;
  name: string;
  description: string | null;
  created_at: string;
}

export interface DocumentWithCategory {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  notes: string | null;
  created_at: string;
  category_id: string | null;
  expiry_date: string | null;
}
