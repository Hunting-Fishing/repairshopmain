
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

export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'owner':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
    case 'management':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
    case 'service_advisor':
      return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
    case 'technician':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  }
}
