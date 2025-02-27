export type CustomRole = {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  permissions?: string[];
};

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
  custom_role_id?: string;
  custom_roles?: {
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

export function getRoleBadgeColor(role: string) {
  const roleColors: Record<string, string> = {
    owner: "bg-purple-100 hover:bg-purple-200 text-purple-800",
    manager: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    service_advisor: "bg-green-100 hover:bg-green-200 text-green-800",
    technician: "bg-orange-100 hover:bg-orange-200 text-orange-800",
    admin: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  };

  return roleColors[role] || "bg-gray-100 hover:bg-gray-200 text-gray-800";
}

export const roles = ["owner", "manager", "service_advisor", "technician", "admin"];

export const roleDefinitions = [
  { id: "owner", name: "Owner", description: "Full system access" },
  { id: "manager", name: "Manager", description: "Manage operations" },
  { id: "service_advisor", name: "Service Advisor", description: "Handles customers" },
  { id: "technician", name: "Technician", description: "Performs repairs" },
  { id: "admin", name: "Office Admin", description: "Administrative work" },
];
