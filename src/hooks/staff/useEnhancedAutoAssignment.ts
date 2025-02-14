
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AutoAssignParams {
  bookingId: string;
  requiredSpecialties?: string[];
  minimumLevel?: 'beginner' | 'intermediate' | 'expert';
  isEmergency?: boolean;
}

interface WorkloadStats {
  technicianId: string;
  totalHours: number;
  bookingCount: number;
}

export function useEnhancedAutoAssignment() {
  const queryClient = useQueryClient();

  const { data: workloadStats } = useQuery({
    queryKey: ['technician-workload'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('technician_workload')
        .select('*')
        .eq('date', today);

      if (error) throw error;
      return data as WorkloadStats[];
    }
  });

  const assignTechnician = useMutation({
    mutationFn: async ({ 
      bookingId, 
      requiredSpecialties,
      minimumLevel = 'beginner',
      isEmergency = false 
    }: AutoAssignParams) => {
      const { data, error } = await supabase
        .rpc('enhanced_auto_assign_technician', {
          p_booking_id: bookingId,
          p_required_specialties: requiredSpecialties,
          p_minimum_level: minimumLevel,
          p_is_emergency: isEmergency
        });

      if (error) throw error;
      if (!data) throw new Error('No suitable technician found');

      // Update the booking with the assigned technician
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          assigned_technician_id: data,
          priority: isEmergency ? 'high' : 'normal',
          is_emergency: isEmergency
        })
        .eq('id', bookingId);

      if (updateError) throw updateError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician-workload'] });
      toast.success("Technician automatically assigned");
    },
    onError: (error) => {
      console.error('Error auto-assigning technician:', error);
      toast.error("Failed to auto-assign technician");
    }
  });

  return {
    assignTechnician,
    workloadStats
  };
}
