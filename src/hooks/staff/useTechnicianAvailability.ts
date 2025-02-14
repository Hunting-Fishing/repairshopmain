
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TimeSlot {
  start: string;
  end: string;
}

interface Availability {
  id: string;
  technician_id: string;
  date: string;
  time_slots: TimeSlot[];
  is_available: boolean;
  reason?: string;
}

export function useTechnicianAvailability(technicianId: string, date: Date) {
  const queryClient = useQueryClient();
  const dateStr = date.toISOString().split('T')[0];

  const { data: availability, isLoading } = useQuery({
    queryKey: ['technician-availability', technicianId, dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technician_availability')
        .select('*')
        .eq('technician_id', technicianId)
        .eq('date', dateStr)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Availability | null;
    },
    enabled: !!technicianId && !!date
  });

  const updateAvailability = useMutation({
    mutationFn: async ({
      isAvailable,
      timeSlots,
      reason
    }: {
      isAvailable: boolean;
      timeSlots?: TimeSlot[];
      reason?: string;
    }) => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("Not authenticated");

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', profile.user.id)
        .single();

      const { data, error } = await supabase
        .from('technician_availability')
        .upsert({
          technician_id: technicianId,
          date: dateStr,
          is_available: isAvailable,
          time_slots: timeSlots || [],
          reason,
          organization_id: userProfile?.organization_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['technician-availability', technicianId, dateStr]
      });
      toast.success("Availability updated successfully");
    },
    onError: (error) => {
      console.error('Error updating availability:', error);
      toast.error("Failed to update availability");
    }
  });

  return {
    availability,
    isLoading,
    updateAvailability
  };
}
