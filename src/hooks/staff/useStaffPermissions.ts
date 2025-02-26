
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

// Define a union type for all possible roles
type SystemRole = 'hr' | 'service_advisor' | 'technician' | 'custom' | 'management' | 'parts' | 'owner' | 'manager' | 'admin';

export function useStaffPermissions() {
  const { user } = useAuth();
  const { data: userProfile, isLoading: profileLoading } = useProfile(user?.id);
  
  const { data: permissions = {}, isLoading } = useQuery({
    queryKey: ["staff-permissions", userProfile?.role, userProfile?.custom_role_id],
    queryFn: async () => {
      if (!userProfile) return defaultPermissions;
      
      const currentRole = userProfile.role as SystemRole;
      
      // Owner and managers have all permissions
      if (currentRole === 'owner' || currentRole === 'manager') {
        return allPermissions;
      }
      
      // For custom roles, fetch permissions from database
      if (userProfile.custom_role_id) {
        const { data, error } = await supabase
          .from("role_permissions")
          .select("permission")
          .eq("custom_role_id", userProfile.custom_role_id);
          
        if (error) {
          console.error("Error fetching role permissions:", error);
          return defaultPermissions;
        }
        
        // Convert array of permission objects to permission map
        if (data && data.length > 0) {
          const permissionMap: Record<string, boolean> = {};
          data.forEach(p => {
            permissionMap[p.permission] = true;
          });
          return {
            ...defaultPermissions,
            ...permissionMap
          };
        }
      }
      
      // For system roles, use predefined permissions
      return rolePermissions[currentRole] || defaultPermissions;
    },
    enabled: !profileLoading && !!userProfile,
  });
  
  const currentRole = userProfile?.role as SystemRole;
  
  return {
    permissions,
    isLoading: isLoading || profileLoading,
    can: (permission: string) => !!permissions[permission],
    isOwnerOrManager: currentRole === 'owner' || currentRole === 'manager',
  };
}

// Default permissions - no access to anything
const defaultPermissions: Record<string, boolean> = {
  'view-staff': false,
  'add-staff': false,
  'edit-staff': false,
  'delete-staff': false,
  'manage-roles': false,
  'view-organization': false,
  'edit-organization': false,
};

// All permissions - full access
const allPermissions: Record<string, boolean> = {
  'view-staff': true,
  'add-staff': true,
  'edit-staff': true,
  'delete-staff': true,
  'manage-roles': true,
  'view-organization': true,
  'edit-organization': true,
};

// Role-specific permission presets
const rolePermissions: Record<SystemRole, Record<string, boolean>> = {
  'service_advisor': {
    ...defaultPermissions,
    'view-staff': true,
    'view-organization': true,
  },
  'technician': {
    ...defaultPermissions,
    'view-staff': true,
  },
  'admin': {
    ...defaultPermissions,
    'view-staff': true,
    'add-staff': true,
    'edit-staff': true,
    'view-organization': true,
  },
  'hr': {
    ...defaultPermissions,
    'view-staff': true,
    'add-staff': true,
    'edit-staff': true,
  },
  'management': {
    ...allPermissions,
  },
  'parts': {
    ...defaultPermissions,
    'view-staff': true,
  },
  'custom': {
    ...defaultPermissions,
  },
  'owner': {
    ...allPermissions,
  },
  'manager': {
    ...allPermissions,
  }
};
