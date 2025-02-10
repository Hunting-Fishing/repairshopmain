
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
}

export interface Technician {
  id: string;
  first_name: string;
  last_name: string;
}
