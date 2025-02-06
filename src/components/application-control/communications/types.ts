
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  metadata: any;
  job_id?: string;
  vehicle_id?: string;
  sender?: {
    first_name: string;
    last_name: string;
  };
}
