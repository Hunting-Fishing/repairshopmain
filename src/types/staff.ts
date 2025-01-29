export type StaffMember = {
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