
export const roles = [
  'hr',
  'service_advisor',
  'technician',
  'custom',
  'management',
  'parts'
] as const;

export type SystemRole = 'hr' | 'service_advisor' | 'technician' | 'custom' | 'management' | 'parts' | 'owner' | 'manager' | 'admin';

export type CustomRole = {
  id: string;
  name: string;
  organization_id: string;
  created_at?: string;
  updated_at?: string;
  permissions?: string[];
};
