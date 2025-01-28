import type { Database } from "@/integrations/supabase/types";

export type ProfileWithCustomRole = Database['public']['Tables']['profiles']['Row'] & {
  custom_roles: {
    name: string | null;
  } | null;
};