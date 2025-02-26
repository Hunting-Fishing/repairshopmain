
import { format } from "date-fns";
import { AlertCircle, Mail, MessageSquare, History } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Timeline, TimelineItem, TimelineDot, TimelineContent } from "@/components/ui/timeline";
import { Card } from "@/components/ui/card";

interface CustomerInteraction {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
}

interface CustomerInteractionTimelineProps {
  interactions: CustomerInteraction[];
}

const typeIcons = {
  email: Mail,
  sms: MessageSquare,
  note: History,
};

export function CustomerInteractionTimeline({ interactions }: CustomerInteractionTimelineProps) {
  // Validation: Check if interactions array is provided
  if (!interactions) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No interaction data available
        </AlertDescription>
      </Alert>
    );
  }

  // Validation: Check for unique IDs
  const ids = new Set();
  const duplicateIds = interactions.some(interaction => {
    if (ids.has(interaction.id)) return true;
    ids.add(interaction.id);
    return false;
  });

  if (duplicateIds) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid interaction data: Duplicate IDs found
        </AlertDescription>
      </Alert>
    );
  }

  // Validation: Check timestamps are within 1 day
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const invalidTimestamps = interactions.some(
    interaction => new Date(interaction.timestamp) < oneDayAgo
  );

  if (invalidTimestamps) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid interaction data: Timestamps must be within the last 24 hours
        </AlertDescription>
      </Alert>
    );
  }

  // Sort interactions by timestamp, most recent first
  const sortedInteractions = [...interactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Timeline>
      {sortedInteractions.map((interaction) => {
        const Icon = typeIcons[interaction.type as keyof typeof typeIcons] || History;
        
        return (
          <TimelineItem key={interaction.id}>
            <TimelineDot />
            <TimelineContent>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground capitalize">
                    {interaction.type}
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {format(new Date(interaction.timestamp), "h:mm a")}
                  </span>
                </div>
                <p className="text-sm">{interaction.message}</p>
              </Card>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
