
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, FileText, Bell } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import type { Communication } from "../../types";

interface CommunicationItemProps {
  communication: Communication;
}

export function CommunicationItem({ communication }: CommunicationItemProps) {
  const getIcon = (type: Communication['type']) => {
    const icons = {
      email: <Mail className="h-4 w-4" />,
      sms: <MessageSquare className="h-4 w-4" />,
      docusign: <FileText className="h-4 w-4" />,
      notification: <Bell className="h-4 w-4" />,
    };
    return icons[type];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {getIcon(communication.type)}
        <CardTitle className="text-sm font-medium">
          {communication.type.charAt(0).toUpperCase() + communication.type.slice(1)}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {format(new Date(communication.sent_at), "PPp")}
        </div>
        {communication.status && <StatusBadge status={communication.status} />}
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm">{communication.content}</div>
          {communication.sender && (
            <div className="text-sm text-muted-foreground">
              Sent by: {communication.sender.first_name} {communication.sender.last_name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
