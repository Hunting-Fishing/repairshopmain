import { Database } from "@/integrations/supabase/types";

export interface StaffMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone_number: string | null;
  role: string;
  hire_date: string | null;
  status: string | null;
  custom_roles: {
    name: string | null;
  } | null;
}

export interface UserProfile {
  organization_id: string;
}

export type EmailData = {
  user_id: string;
  email: string;
};