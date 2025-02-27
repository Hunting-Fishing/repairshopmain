
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { StaffMember } from '../types';

export function useStaffMembers() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['staff-members-for-roles'],
    queryFn: async () => {
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // First get the organization ID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile?.organization_id) {
        throw new Error('No organization ID found for user');
      }

      // Then get all staff in the organization
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          custom_role_id,
          phone_number
        `)
        .eq('organization_id', profile.organization_id);

      if (error) {
        throw error;
      }

      return data as StaffMember[];
    },
    enabled: !!user,
  });
}
