
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PointsDisplay } from "./PointsDisplay";
import { RewardsList } from "./RewardsList";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export function LoyaltyTab() {
  const { user } = useAuth();

  const { data: customer, refetch } = useQuery({
    queryKey: ["customer-loyalty"],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("customers")
        .select("loyalty_points, loyalty_tier, loyalty_join_date")
        .eq("auth_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: redemptions } = useQuery({
    queryKey: ["reward-redemptions"],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("loyalty_reward_redemptions")
        .select(`
          *,
          reward:loyalty_rewards(name, points_cost)
        `)
        .eq("customer_id", user.id)
        .order("redeemed_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="space-y-6">
      {customer && (
        <PointsDisplay 
          points={customer.loyalty_points} 
          tier={customer.loyalty_tier} 
        />
      )}

      <Tabs defaultValue="rewards">
        <TabsList>
          <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
          <TabsTrigger value="history">Redemption History</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="mt-6">
          <RewardsList 
            customerPoints={customer?.loyalty_points ?? 0}
            onRewardRedeemed={refetch}
          />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Redemption History</CardTitle>
              <CardDescription>View your past reward redemptions</CardDescription>
            </CardHeader>
            <CardContent>
              {!redemptions?.length ? (
                <p className="text-center py-4 text-muted-foreground">
                  No redemptions yet
                </p>
              ) : (
                <div className="space-y-4">
                  {redemptions.map((redemption) => (
                    <div 
                      key={redemption.id}
                      className="flex justify-between items-center border-b pb-4 last:border-0"
                    >
                      <div>
                        <p className="font-medium">{redemption.reward?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(redemption.redeemed_at!), "PPp")}
                        </p>
                      </div>
                      <span className="text-orange-500 font-medium">
                        -{redemption.points_cost} points
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
