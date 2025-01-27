import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { BookingForm } from "./BookingForm";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTimeSlot: { start: Date; end: Date } | null;
  onBookingCreated: () => void;
}

interface BookingFormValues {
  customerName: string;
  vehicleInfo: string;
  jobDescription: string;
  assignedTechnicianId: string;
}

export function BookingDialog({
  open,
  onOpenChange,
  selectedTimeSlot,
  onBookingCreated,
}: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<BookingFormValues>();

  const onSubmit = async (values: BookingFormValues) => {
    if (!selectedTimeSlot) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        customer_name: values.customerName,
        vehicle_info: values.vehicleInfo,
        job_description: values.jobDescription,
        assigned_technician_id: values.assignedTechnicianId,
        start_time: selectedTimeSlot.start.toISOString(),
        end_time: selectedTimeSlot.end.toISOString(),
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        organization_id: (
          await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", (await supabase.auth.getUser()).data.user?.id)
            .single()
        ).data?.organization_id,
      });

      if (error) throw error;

      toast({
        title: "Booking created",
        description: "The booking has been created successfully.",
      });

      form.reset();
      onBookingCreated();
    } catch (error: any) {
      toast({
        title: "Error creating booking",
        description: error.message,
        variant: "destructive",
      });
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