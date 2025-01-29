import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTimeOff } from "@/hooks/staff/useTimeOff";
import { TimeOffDialog } from "./TimeOffDialog";

export function TimeOffList() {
  const { timeOffRequests, isLoading } = useTimeOff();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Time Off Requests</CardTitle>
            <CardDescription>Manage your time off requests</CardDescription>
          </div>
          <TimeOffDialog />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeOffRequests?.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 className="font-medium capitalize">{request.type}</h4>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(request.start_date), 'PPP')} -{' '}
                  {format(new Date(request.end_date), 'PPP')}
                </p>
                {request.notes && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {request.notes}
                  </p>
                )}
              </div>
              <Badge className={getStatusColor(request.status)}>
                {request.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}