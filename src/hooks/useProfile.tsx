
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ProfileRow } from "@/types/database/tables/profiles";

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      console.log("Fetching profile for user:", userId);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            first_name,
            last_name,
            role,
            theme_preference,
            organization_id,
            status,
            custom_role_id,
            created_at,
            updated_at,
            calendar_settings,
            technician_settings,
            schedule,
            hire_date,
            notes,
            invitation_token,
            invitation_sent_at,
            street_address,
            city,
            state_province,
            postal_code,
            country,
            phone_number,
            emergency_contact,
            preferred_working_hours,
            certifications,
            color_preferences,
            skills,
            dashboard_preferences
          `)
          .eq('id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load user profile");
          throw error;
        }

        if (!data) {
          console.warn("No profile found for user:", userId);
          return null;
        }
        
        return data as ProfileRow;
      } catch (err) {
        console.error("Unexpected error in useProfile:", err);
        toast.error("An unexpected error occurred while loading your profile");
        throw err;
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: 3
  });
}
