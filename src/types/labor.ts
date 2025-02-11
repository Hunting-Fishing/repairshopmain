
export interface LaborEntry {
  id: string;
  technician_id: string;
  start_time: string;
  end_time: string | null;
  rate_per_hour: number;
  notes: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  error_details?: string;
  technician: {
    first_name: string;
    last_name: string;
  };
  labor_rate_source: 'manual' | 'default' | 'technician' | 'template';
  estimated_duration_minutes?: number;
  actual_duration_minutes?: number;
  is_timer_running: boolean;
  timer_started_at?: string;
  last_timer_update?: string;
  labor_rate_type: 'default' | 'overtime' | 'holiday' | 'custom';
  efficiency_score?: number;
}

export interface Technician {
  id: string;
  first_name: string;
  last_name: string;
}
