
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Specialty {
  id: string;
  name: string;
  description: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export function useSpecialties() {
  const queryClient = useQueryClient();

  const { data: specialties, isLoading } = useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technician_specialties')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Specialty[];
    }
  });

  const addSpecialty = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', profile.user.id)
        .single();

      const { data, error } = await supabase
        .from('technician_specialties')
        .insert([{
          name,
          description,
          organization_id: userProfile?.organization_id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      toast.success("Specialty added successfully");
    },
    onError: (error) => {
      console.error('Error adding specialty:', error);
      toast.error("Failed to add specialty");
    }
  });

  return {
    specialties,
    isLoading,
    addSpecialty
  };
}
