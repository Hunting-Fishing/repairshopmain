
import type { EmailTemplate } from "../types";

export interface TemplateVersion {
  id: string;
  template_id: string;
  version_number: number;
  content: string;
  metadata: {
    subject: string;
    name: string;
    category_id?: string;
    notification_settings: EmailTemplate['notification_settings'];
  };
  created_at: string;
  created_by: string;
  organization_id: string;
}

export interface TemplateComponent {
  id: string;
  name: string;
  content: string;
  category: string;
  organization_id: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TemplateTag {
  id: string;
  name: string;
  color: string;
  organization_id: string;
  created_at: string;
}

export interface TemplateTagAssignment {
  template_id: string;
  tag_id: string;
  created_at: string;
}

export interface TemplateFilters {
  searchQuery: string;
  categories: string[];
  tags: string[];
  status: 'all' | 'active' | 'archived';
  dateRange?: {
    from: Date;
    to?: Date;  // Make 'to' optional to match DateRange type
  };
  sortBy: 'name' | 'created_at' | 'updated_at' | 'last_used';
  sortOrder: 'asc' | 'desc';
}
