
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, FileText, Calendar, ShoppingBag, Gauge, Star } from "lucide-react";
import { TimelineItem } from "./TimelineItem";

interface Activity {
  type: string;
  date: string;
  data: Record<string, any>;
}

interface CustomerActivityTimelineProps {
  activities: Activity[];
}

export function CustomerActivityTimeline({ activities }: CustomerActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    const icons = {
      communication: MessageCircle,
      document: FileText,
      appointment: Calendar,
      purchase: ShoppingBag,
      engagement: Gauge,
      feedback: Star
    };

    const IconComponent = icons[type as keyof typeof icons] || MessageCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            activities.slice(0, 5).map((activity, index) => (
              <TimelineItem
                key={index}
                title={activity.type.replace('_', ' ')}
                description={activity.data.description || 'No description available'}
                date={new Date(activity.date)}
                icon={getActivityIcon(activity.type)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
