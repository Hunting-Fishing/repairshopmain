import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TimeOffRequest {
  id: string;
  profile_id: string;
  start_date: string;
  end_date: string;
  type: 'vacation' | 'sick' | 'personal' | 'training';
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export function useTimeOff() {
  const queryClient = useQueryClient();

  const { data: timeOffRequests, isLoading } = useQuery({
    queryKey: ["time-off-requests"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("staff_time_off")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data as TimeOffRequest[];
    },
  });

  const createTimeOff = useMutation({
    mutationFn: async (request: Omit<TimeOffRequest, "id" | "profile_id" | "status">) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", session.user.id)
        .single();

      const { data, error } = await supabase
        .from("staff_time_off")
        .insert({
          ...request,
          profile_id: session.user.id,
          organization_id: profile?.organization_id,
          created_by: session.user.id,
          updated_by: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-off-requests"] });
      toast.success("Time off request submitted successfully");
    },
    onError: (error) => {
      console.error("Error creating time off request:", error);
      toast.error("Failed to submit time off request");
    },
  });

  return {
    timeOffRequests,
    isLoading,
    createTimeOff,
  };
}