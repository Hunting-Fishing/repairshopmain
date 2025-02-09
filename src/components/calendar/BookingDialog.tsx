
import { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { useBookingForm } from "@/hooks/useBookingForm";
import { BookingDialogProps } from "@/types/bookings";

export function BookingDialog({
  open,
  onOpenChange,
  selectedTimeSlot,
  onBookingCreated,
}: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, createBooking } = useBookingForm({
    onSuccess: onBookingCreated,
  });

  const onSubmit = async (values: any) => {
    if (!selectedTimeSlot) return;

    setIsSubmitting(true);
    try {
      await createBooking(values, selectedTimeSlot);
      onOpenChange(false);
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
          <DialogTitle>Create Booking</DialogTitle>
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
        />
      </DialogContent>
    </Dialog>
  );
}
