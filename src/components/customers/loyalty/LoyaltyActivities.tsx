
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoyaltyActivities } from "./hooks/useLoyaltyActivities";
import { formatDistance } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LoyaltyActivitiesProps {
  customerId: string;
}

export function LoyaltyActivities({ customerId }: LoyaltyActivitiesProps) {
  const { activities, isLoading } = useLoyaltyActivities(customerId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities?.map((activity) => (
              <Card key={activity.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{activity.activity_type}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    {activity.points_earned > 0 && (
                      <p className="text-green-600">+{activity.points_earned} points</p>
                    )}
                    {activity.points_redeemed > 0 && (
                      <p className="text-orange-600">-{activity.points_redeemed} points</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formatDistance(new Date(activity.created_at), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            {(!activities || activities.length === 0) && (
              <p className="text-center text-muted-foreground py-8">
                No loyalty activities recorded yet
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
