
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format } from "date-fns";
import { useTechnicianAvailability } from "@/hooks/staff/useTechnicianAvailability";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface TimeSlot {
  start: string;
  end: string;
}

export function TechnicianAvailability({ technicianId }: { technicianId?: string }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { availability, isLoading, updateAvailability } = useTechnicianAvailability(
    technicianId || '', 
    selectedDate
  );

  const [isAvailable, setIsAvailable] = useState(true);
  const [reason, setReason] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: startTime, end: endTime }]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateAvailability.mutateAsync({
        isAvailable,
        timeSlots,
        reason: !isAvailable ? reason : undefined
      });
      toast.success("Availability updated successfully");
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error("Failed to update availability");
    }
  };

  if (!technicianId) {
    return (
      <Card>
        <CardContent>
          <p className="text-muted-foreground">Please select a technician</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <Label>Available</Label>
            </div>

            {!isAvailable && (
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for unavailability..."
                />
              </div>
            )}

            {isAvailable && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>

                <div className="space-y-2">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between bg-accent p-2 rounded">
                      <span>
                        {slot.start} - {slot.end}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTimeSlot(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleSave}
              disabled={!isAvailable && !reason}
            >
              Save Availability
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
