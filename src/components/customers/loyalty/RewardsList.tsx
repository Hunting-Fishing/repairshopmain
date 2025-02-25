
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RewardCard } from "./RewardCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RewardsListProps {
  customerPoints: number;
  onRewardRedeemed?: () => void;
}

export function RewardsList({ customerPoints, onRewardRedeemed }: RewardsListProps) {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ["loyalty-rewards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_rewards")
        .select("*")
        .eq("is_available", true)
        .order("points_cost", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}
      </div>
    );
  }

  if (!rewards?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rewards available at the moment
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          customerPoints={customerPoints}
          onRedeem={onRewardRedeemed}
        />
      ))}
    </div>
  );
}
