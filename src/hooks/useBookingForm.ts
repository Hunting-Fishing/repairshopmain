
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BookingFormValues } from "@/types/bookings";

export function useBookingForm({ onSuccess }: { onSuccess: () => void }) {
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

  const createBooking = async (values: BookingFormValues, selectedTimeSlot: { start: Date; end: Date }) => {
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
    onSuccess();
  };

  return {
    form,
    createBooking,
  };
}
