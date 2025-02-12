
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface SchedulingSectionProps {
  isScheduled: boolean;
  setIsScheduled: (value: boolean) => void;
  scheduledDate?: Date;
  setScheduledDate: (date?: Date) => void;
}

export function SchedulingSection({
  isScheduled,
  setIsScheduled,
  scheduledDate,
  setScheduledDate
}: SchedulingSectionProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          checked={isScheduled}
          onCheckedChange={setIsScheduled}
          id="schedule-email"
        />
        <Label htmlFor="schedule-email">Schedule Email</Label>
      </div>

      {isScheduled && (
        <div className="flex flex-col space-y-2">
          <Label>Schedule Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!scheduledDate && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
}
