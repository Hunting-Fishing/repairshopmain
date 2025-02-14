
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AutoAssignParams {
  bookingId: string;
  requiredSpecialties?: string[];
}

export function useAutoAssignment() {
  const assignTechnician = useMutation({
    mutationFn: async ({ bookingId, requiredSpecialties }: AutoAssignParams) => {
      const { data, error } = await supabase
        .rpc('auto_assign_technician', {
          booking_id: bookingId,
          required_specialties: requiredSpecialties
        });

      if (error) throw error;
      if (!data) throw new Error('No suitable technician found');

      // Update the booking with the assigned technician
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ assigned_technician_id: data })
        .eq('id', bookingId);

      if (updateError) throw updateError;
      return data;
    },
    onSuccess: () => {
      toast.success("Technician automatically assigned");
    },
    onError: (error) => {
      console.error('Error auto-assigning technician:', error);
      toast.error("Failed to auto-assign technician");
    }
  });

  return {
    assignTechnician
  };
}
