
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { CheckCircle2, Clock, XCircle, AlertCircle, User } from "lucide-react";
import { useTemplateEvents } from "../../hooks/useTemplateEvents";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ApprovalHistoryProps {
  templateId: string;
}

export function ApprovalHistory({ templateId }: ApprovalHistoryProps) {
  const { events, isLoading } = useTemplateEvents(templateId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!events.length) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
        <p>No approval history available</p>
      </div>
    );
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'changes_requested':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEventTitle = (eventType: string) => {
    switch (eventType) {
      case 'approval_requested':
        return 'Approval Requested';
      case 'approved':
        return 'Template Approved';
      case 'rejected':
        return 'Template Rejected';
      case 'changes_requested':
        return 'Changes Requested';
      case 'version_created':
        return 'New Version Created';
      default:
        return eventType;
    }
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative pl-6 pb-4 border-l last:pb-0"
          >
            <div className="absolute left-0 top-2 w-2 h-2 -ml-1">
              {getEventIcon(event.event_type)}
            </div>
            <div className="mb-1">
              <span className="font-medium">{getEventTitle(event.event_type)}</span>
              <span className="mx-2">•</span>
              <span className="text-muted-foreground">
                {format(new Date(event.performed_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <User className="h-4 w-4" />
              <span>
                {event.profiles?.first_name} {event.profiles?.last_name}
              </span>
            </div>
            {event.notes && (
              <div className="mt-2 text-sm text-muted-foreground">
                {event.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
