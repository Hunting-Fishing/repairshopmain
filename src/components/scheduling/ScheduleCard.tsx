
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface ScheduleProps {
  schedule: {
    technician: {
      name: string;
    };
    appointment: {
      date: string;
      time: string;
    };
  };
}

export function ScheduleCard({ schedule }: ScheduleProps) {
  const appointmentDate = new Date(schedule.appointment.date);

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Appointment with {schedule.technician.name}</span>
          <Button 
            variant="outline"
            className="hover:bg-primary/10"
          >
            Reschedule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <Calendar
              mode="single"
              selected={appointmentDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
            <div>
              <h3 className="font-semibold">Appointment Details</h3>
              <p className="text-muted-foreground">
                {format(appointmentDate, "MMMM d, yyyy")}
              </p>
              <p className="text-muted-foreground">
                Time: {schedule.appointment.time}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
