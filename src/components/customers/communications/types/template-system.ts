
import type { EmailTemplate } from "../types";

export type ApprovalStatus = 'draft' | 'pending_review' | 'approved' | 'rejected';

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

export interface TemplateApprover {
  id: string;
  organization_id: string;
  user_id: string;
  can_approve_all: boolean;
  category_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface TemplateApprovalHistory {
  id: string;
  organization_id: string;
  template_id: string;
  action: string;
  status: ApprovalStatus;
  performed_by: string;
  notes?: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface TemplateFilters {
  searchQuery: string;
  categories: string[];
  tags: string[];
  status: 'all' | 'active' | 'archived';
  dateRange?: {
    from: Date;
    to?: Date;
  };
  sortBy: 'name' | 'created_at' | 'updated_at' | 'last_used';
  sortOrder: 'asc' | 'desc';
}

