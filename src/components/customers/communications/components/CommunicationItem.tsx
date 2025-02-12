
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, FileText, Bell } from "lucide-react";
import { format } from "date-fns";

interface CommunicationItemProps {
  communication: any; // We'll improve this type later
}

export function CommunicationItem({ communication }: CommunicationItemProps) {
  const getIcon = (type: string) => {
    const icons = {
      email: <Mail className="h-4 w-4" />,
      sms: <MessageSquare className="h-4 w-4" />,
      docusign: <FileText className="h-4 w-4" />,
      notification: <Bell className="h-4 w-4" />,
    };
    return icons[type as keyof typeof icons];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {getIcon(communication.type ?? 'sms')}
        <CardTitle className="text-sm font-medium">
          {'type' in communication ? communication.type.charAt(0).toUpperCase() + communication.type.slice(1) : 'SMS'}
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {format(new Date(communication.sent_at), "PPp")}
        </div>
        {'status' in communication && (
          <div className={`text-sm ml-auto ${
            communication.status === 'delivered' ? 'text-green-600' :
            communication.status === 'failed' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {communication.status}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="text-sm">{communication.content}</div>
          {'sender' in communication && (
            <div className="text-sm text-muted-foreground">
              Sent by: {communication.sender.first_name} {communication.sender.last_name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
