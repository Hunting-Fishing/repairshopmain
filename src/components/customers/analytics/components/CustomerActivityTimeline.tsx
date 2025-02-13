
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity } from "lucide-react";

interface CustomerActivityTimelineProps {
  activities: Array<{
    type: string;
    date: string;
    data: Record<string, any>;
  }>;
}

export function CustomerActivityTimeline({ activities }: CustomerActivityTimelineProps) {
  const getActivityDescription = (activity: { type: string; data: Record<string, any> }) => {
    switch (activity.type) {
      case 'repair':
        return `Repair service - ${activity.data.description || 'Service completed'}`;
      case 'feedback':
        return `Provided feedback - Rating: ${activity.data.rating}/5`;
      case 'loyalty_redemption':
        return `Redeemed ${activity.data.points} loyalty points`;
      case 'communication':
        return `${activity.data.type || 'Communication'} interaction`;
      case 'document_upload':
        return `Uploaded document: ${activity.data.name || 'File'}`;
      case 'appointment_booking':
        return 'Scheduled an appointment';
      case 'payment':
        return `Payment of $${activity.data.amount || '0'}`;
      default:
        return 'Customer activity';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No recent activity recorded
            </p>
          ) : (
            activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-4 border-b last:border-0"
              >
                <div className="w-full">
                  <p className="font-medium">
                    {getActivityDescription(activity)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(activity.date), 'PPp')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
