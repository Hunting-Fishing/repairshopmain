
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { StaffMember } from '../types';

export function useRoleUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRole = async (
    userId: string,
    newRole: string,
    customRoleId?: string
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const updateData: { role: string; custom_role_id?: string | null } = {
        role: newRole
      };

      // If role is custom, set the custom_role_id
      if (newRole === 'custom') {
        if (!customRoleId) {
          throw new Error('Custom role ID is required when role is set to custom');
        }
        updateData.custom_role_id = customRoleId;
      } else {
        // Clear custom_role_id when role is not custom
        updateData.custom_role_id = null;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Role Updated',
        description: 'Staff member role has been updated successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      toast({
        title: 'Error',
        description: 'Failed to update staff member role',
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateRole,
    isUpdating,
    error
  };
}
