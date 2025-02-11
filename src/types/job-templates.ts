
export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
}

export interface VehicleCompatibility {
  id: string;
  make?: string;
  model?: string;
  year_start?: number;
  year_end?: number;
}

export interface TemplateFeedback {
  id: string;
  rating: number;
  comments?: string;
  technician: {
    first_name: string;
    last_name: string;
  };
}

export interface JobTemplate {
  id: string;
  name: string;
  description: string;
  category_id?: string;
  category?: string;
  estimated_hours: number | null;
  version: number;
  required_certifications: string[];
  typical_parts: Array<{
    name: string;
    quantity: number;
  }>;
  required_tools: string[];
  difficulty_level?: number;
  estimated_duration_range: {
    min: number;
    max: number;
  };
  parts_required: any | null;
  is_active: boolean;
  organization_id: string | null;
  job_number: string | null;
  sub_tasks: any[] | null;
  timeline: Record<string, any> | null;
  status: JobStatus;
  compatibility?: VehicleCompatibility[];
  feedback?: TemplateFeedback[];
  usage_stats?: {
    use_count: number;
    avg_completion_time?: number;
    success_rate?: number;
  };
}
