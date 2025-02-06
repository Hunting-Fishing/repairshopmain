
export interface Message {
  id: string;
  content: string;
  content_type?: string;
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

export type RoomType = 'direct' | 'work_order' | 'group' | 'general';

export interface ChatRoom {
  id: string;
  name: string | null;
  type: string;
  room_type: RoomType;
  category: string;
  created_at: string;
  created_by: string;
  organization_id: string;
  is_private: boolean;
  metadata: any;
  last_message_at: string;
  work_order_id?: string;
}

