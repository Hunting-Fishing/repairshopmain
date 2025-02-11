
import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { useBookingForm } from "@/hooks/useBookingForm";
import { BookingDialogProps } from "@/types/bookings";
import { scheduleWorkOrder } from "@/utils/workOrderScheduling";

export function BookingDialog({
  open,
  onOpenChange,
  selectedTimeSlot,
  onBookingCreated,
  workOrderId,
  technicianId,
}: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, createBooking } = useBookingForm({
    onSuccess: onBookingCreated,
  });

  const onSubmit = async (values: any) => {
    if (!selectedTimeSlot) return;

    setIsSubmitting(true);
    try {
      if (workOrderId && technicianId) {
        // Handle work order scheduling
        const success = await scheduleWorkOrder({
          workOrderId,
          technicianId,
          startTime: selectedTimeSlot.start,
          estimatedDurationMinutes: values.duration_minutes || 60
        });
        if (success) {
          onBookingCreated();
          onOpenChange(false);
        }
      } else {
        // Handle regular booking creation
        await createBooking(values, selectedTimeSlot);
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {workOrderId ? 'Schedule Work Order' : 'Create Booking'}
          </DialogTitle>
        </DialogHeader>

        {selectedTimeSlot && (
          <div className="text-sm text-muted-foreground">
            {format(selectedTimeSlot.start, "EEEE, MMMM d, yyyy")} at{" "}
            {format(selectedTimeSlot.start, "HH:mm")} -{" "}
            {format(selectedTimeSlot.end, "HH:mm")}
          </div>
        )}

        <BookingForm
          form={form}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          isWorkOrder={!!workOrderId}
        />
      </DialogContent>
    </Dialog>
  );
}
