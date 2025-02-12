
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineItem } from "./TimelineItem";

interface CustomerActivityTimelineProps {
  lastRepairDate?: string;
  lastFeedbackDate?: string;
  customerSince?: string;
}

export function CustomerActivityTimeline({ 
  lastRepairDate,
  lastFeedbackDate,
  customerSince
}: CustomerActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lastRepairDate && (
            <TimelineItem
              label="Last Repair"
              date={lastRepairDate}
            />
          )}
          {lastFeedbackDate && (
            <TimelineItem
              label="Last Feedback"
              date={lastFeedbackDate}
            />
          )}
          {customerSince && (
            <TimelineItem
              label="Customer Since"
              date={customerSince}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
