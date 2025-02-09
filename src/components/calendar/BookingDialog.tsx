
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
  phoneNumber: string;
  email: string;
  notes: string;
  estimatedCost: number;
  priority: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
}

export function BookingDialog({
  open,
  onOpenChange,
  selectedTimeSlot,
  onBookingCreated,
}: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<BookingFormValues>({
    defaultValues: {
      customerName: "",
      vehicleInfo: "",
      jobDescription: "",
      assignedTechnicianId: "",
      phoneNumber: "",
      email: "",
      notes: "",
      estimatedCost: 0,
      priority: "normal",
      notificationPreferences: {
        email: true,
        sms: false,
      },
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    if (!selectedTimeSlot) return;

    setIsSubmitting(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      const profile = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user?.id)
        .single();

      const { error } = await supabase.from("bookings").insert({
        customer_name: values.customerName,
        vehicle_info: values.vehicleInfo,
        job_description: values.jobDescription,
        assigned_technician_id: values.assignedTechnicianId,
        start_time: selectedTimeSlot.start.toISOString(),
        end_time: selectedTimeSlot.end.toISOString(),
        created_by: user?.id,
        updated_by: user?.id,
        organization_id: profile.data?.organization_id,
        phone_number: values.phoneNumber,
        email: values.email,
        notes: values.notes,
        estimated_cost: values.estimatedCost,
        priority: values.priority,
        notification_preferences: values.notificationPreferences,
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
