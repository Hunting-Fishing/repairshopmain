
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SpecialtyAssignment {
  id: string;
  technician_id: string;
  specialty_id: string;
  created_at: string;
}

export function useSpecialtyAssignments(technicianId: string) {
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['specialty-assignments', technicianId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technician_specialty_assignments')
        .select(`
          *,
          specialty:technician_specialties(*)
        `)
        .eq('technician_id', technicianId);

      if (error) throw error;
      return data;
    },
    enabled: !!technicianId
  });

  const assignSpecialty = useMutation({
    mutationFn: async ({ specialtyId }: { specialtyId: string }) => {
      const { data, error } = await supabase
        .from('technician_specialty_assignments')
        .insert([{
          technician_id: technicianId,
          specialty_id: specialtyId
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialty-assignments', technicianId] });
      toast.success("Specialty assigned successfully");
    },
    onError: (error) => {
      console.error('Error assigning specialty:', error);
      toast.error("Failed to assign specialty");
    }
  });

  const removeAssignment = useMutation({
    mutationFn: async (assignmentId: string) => {
      const { error } = await supabase
        .from('technician_specialty_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialty-assignments', technicianId] });
      toast.success("Specialty removed successfully");
    },
    onError: (error) => {
      console.error('Error removing specialty:', error);
      toast.error("Failed to remove specialty");
    }
  });

  return {
    assignments,
    isLoading,
    assignSpecialty,
    removeAssignment
  };
}
