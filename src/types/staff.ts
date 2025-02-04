
export type StaffMember = {
  id: string;
  organization_id: string;
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
  notes?: string | null;
  emergency_contact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  } | null;
  preferred_working_hours?: {
    [key: string]: string;
  } | null;
  skills?: string[];
  certifications?: Array<{
    name: string;
    date: string;
    expiry?: string;
  }>;
};

export type UserProfile = {
  organization_id: string;
};

export type GetOrganizationUserEmailsResponse = Array<{
  user_id: string;
  email: string;
}>;

export type GetOrganizationUserEmailsArgs = {
  org_id: string;
};
