
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RewardCardProps {
  reward: {
    id: string;
    name: string;
    description: string | null;
    points_cost: number;
    reward_type: string;
  };
  customerPoints: number;
  onRedeem?: () => void;
}

export function RewardCard({ reward, customerPoints, onRedeem }: RewardCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { toast } = useToast();
  const canRedeem = customerPoints >= reward.points_cost;

  const handleRedeem = async () => {
    try {
      setIsRedeeming(true);
      
      const { error } = await supabase.rpc('redeem_loyalty_reward', {
        p_customer_id: (await supabase.auth.getUser()).data.user?.id,
        p_reward_id: reward.id,
        p_points_cost: reward.points_cost
      });

      if (error) throw error;

      toast({
        title: "Reward Redeemed!",
        description: `You have successfully redeemed ${reward.name}`,
      });

      onRedeem?.();
    } catch (error: any) {
      toast({
        title: "Failed to redeem reward",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-orange-500" />
          {reward.name}
        </CardTitle>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-orange-500">{reward.points_cost} points</span>
          <Button 
            onClick={handleRedeem}
            disabled={!canRedeem || isRedeeming}
            variant={canRedeem ? "default" : "secondary"}
          >
            {isRedeeming ? "Redeeming..." : "Redeem"}
          </Button>
        </div>
        {!canRedeem && (
          <p className="text-sm text-muted-foreground mt-2">
            You need {reward.points_cost - customerPoints} more points to redeem this reward
          </p>
        )}
      </CardContent>
    </Card>
  );
}
