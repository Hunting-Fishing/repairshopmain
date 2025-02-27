
export type StaffRole = 
  | "owner" 
  | "management" 
  | "technician" 
  | "service_advisor" 
  | "admin" 
  | "accountant" 
  | "customer_service";

export type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  custom_role_id?: string | null;
};

export type CustomRole = {
  id: string;
  name: string;
  organization_id: string;
};

export const roles = ['owner', 'management', 'service_advisor', 'technician', 'custom'] as const;

/**
 * Determines the CSS class for role badges based on the role type
 */
export function getRoleBadgeColor(role: string): string {
  const roleColors: Record<string, string> = {
    owner: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
    management: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    technician: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    service_advisor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    admin: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    accountant: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100",
    customer_service: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
  };
  
  return roleColors[role] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
}
