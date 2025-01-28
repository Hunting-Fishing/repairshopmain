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

export type EmailData = Database["public"]["Functions"]["get_organization_user_emails"]["Returns"][number];

export type GetOrganizationUserEmailsResponse = Database["public"]["Functions"]["get_organization_user_emails"]["Returns"];

export type GetOrganizationUserEmailsArgs = Database["public"]["Functions"]["get_organization_user_emails"]["Args"];