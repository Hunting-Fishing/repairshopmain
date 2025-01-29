import type { Database } from '@/types/database'

export type ProfileWithCustomRole = Database['public']['Tables']['profiles']['Row'] & {
  custom_roles: {
    name: string | null;
  } | null;
};