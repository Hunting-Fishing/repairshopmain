
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useLoyaltyActivities(customerId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ["loyalty-activities", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_loyalty_activities")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!customerId,
  });

  const addActivity = useMutation({
    mutationFn: async (activity: {
      customerId: string;
      activityType: string;
      pointsEarned?: number;
      pointsRedeemed?: number;
      description?: string;
    }) => {
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) throw new Error("User not authenticated");

      const { data: orgData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user.id)
        .single();

      const { error } = await supabase
        .from("customer_loyalty_activities")
        .insert({
          customer_id: activity.customerId,
          organization_id: orgData.organization_id,
          activity_type: activity.activityType,
          points_earned: activity.pointsEarned || 0,
          points_redeemed: activity.pointsRedeemed || 0,
          description: activity.description,
          created_by: profile.user.id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-activities", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers", customerId] });
      toast({
        title: "Activity recorded",
        description: "Customer loyalty activity has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record activity: " + error.message,
      });
    },
  });

  return {
    activities,
    isLoading,
    addActivity,
  };
}
