import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TrainingRecord {
  id: string;
  training_name: string;
  description: string;
  completion_date: string | null;
  expiry_date: string | null;
  status: string;
}

export function useTrainingRecords() {
  return useQuery({
    queryKey: ["staff-training"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("staff_training")
        .select("*")
        .eq("profile_id", session.user.id);

      if (error) throw error;
      return data as TrainingRecord[];
    },
  });
}