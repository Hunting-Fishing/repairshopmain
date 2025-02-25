
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { LoyaltyProgramUser, LoyaltyReward } from "@/types/loyalty";
import { Star, Gift, Trophy } from "lucide-react";

interface LoyaltyManagementProps {
  customerId: string;
}

export function LoyaltyManagement({ customerId }: LoyaltyManagementProps) {
  const queryClient = useQueryClient();
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);

  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ['loyalty', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select(`
          id,
          first_name,
          last_name,
          email,
          loyalty_points,
          loyalty_tier
        `)
        .eq('id', customerId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: availableRewards } = useQuery({
    queryKey: ['loyalty-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('is_available', true);

      if (error) throw error;
      return data;
    },
  });

  const redeemReward = useMutation({
    mutationFn: async (rewardId: string) => {
      const { error } = await supabase.functions.invoke('redeem-reward', {
        body: { customerId, rewardId }
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loyalty'] });
      toast.success("Reward redeemed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to redeem reward: " + error.message);
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'text-yellow-500';
      case 'silver': return 'text-gray-400';
      default: return 'text-amber-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Loyalty Program Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Current Tier</div>
            <div className={`text-2xl font-bold ${getTierColor(loyaltyData?.loyalty_tier)}`}>
              {loyaltyData?.loyalty_tier?.toUpperCase()}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Points Balance</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {loyaltyData?.loyalty_points || 0}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Available Rewards</div>
            <div className="text-2xl font-bold">
              {availableRewards?.length || 0}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Available Rewards
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {availableRewards?.map((reward) => (
              <Card key={reward.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{reward.name}</h4>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4" />
                      {reward.points_cost}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    disabled={!loyaltyData || loyaltyData.loyalty_points < reward.points_cost}
                    onClick={() => redeemReward.mutate(reward.id)}
                  >
                    Redeem Reward
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
