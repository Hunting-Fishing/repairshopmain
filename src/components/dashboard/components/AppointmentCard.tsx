
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, User, Wrench } from "lucide-react";

interface AppointmentCardProps {
  appointment: any;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium">{appointment.customer_name}</h3>
            <p className="text-sm text-muted-foreground">
              {appointment.vehicle_info}
            </p>
          </div>
          <Badge variant={appointment.status === "completed" ? "success" : "default"}>
            {appointment.status || "scheduled"}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(appointment.start_time), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(appointment.start_time), "p")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.job_description}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>
              {appointment.profiles ? 
                `${appointment.profiles.first_name} ${appointment.profiles.last_name}` : 
                "Unassigned"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
