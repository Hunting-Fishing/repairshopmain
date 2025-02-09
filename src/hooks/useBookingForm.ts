
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BookingFormValues } from "@/types/bookings";
import { bookingSchema, validateBookingTime } from "@/lib/validations/bookingValidation";

export function useBookingForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
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

  const createBooking = async (values: BookingFormValues, selectedTimeSlot: { start: Date; end: Date }) => {
    // Validate time slot
    const timeValidation = await validateBookingTime(
      selectedTimeSlot.start,
      selectedTimeSlot.end,
      [] // You'll need to pass existing bookings here
    );

    if (!timeValidation.isValid) {
      toast({
        title: "Booking Error",
        description: timeValidation.error,
        variant: "destructive",
      });
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    const profile = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user?.id)
      .single();

    if (!profile.data?.organization_id) {
      toast({
        title: "Error",
        description: "Unable to create booking: Missing organization",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      customer_name: values.customerName,
      vehicle_info: values.vehicleInfo,
      job_description: values.jobDescription,
      assigned_technician_id: values.assignedTechnicianId,
      start_time: selectedTimeSlot.start.toISOString(),
      end_time: selectedTimeSlot.end.toISOString(),
      created_by: user?.id,
      updated_by: user?.id,
      organization_id: profile.data.organization_id,
      phone_number: values.phoneNumber,
      email: values.email,
      notes: values.notes,
      estimated_cost: values.estimatedCost,
      priority: values.priority,
      notification_preferences: values.notificationPreferences,
    });

    if (error) {
      toast({
        title: "Error creating booking",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking created",
      description: "The booking has been created successfully.",
    });

    form.reset();
    onSuccess();
  };

  return {
    form,
    createBooking,
  };
}
