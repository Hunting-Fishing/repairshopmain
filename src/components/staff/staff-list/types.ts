import { Database } from "@/types/database";

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

export type GetOrganizationUserEmailsResponse = {
  user_id: string;
  email: string;
}[];

export type GetOrganizationUserEmailsArgs = {
  org_id: string;
};