import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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

  const { data: technicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .order("first_name");

      if (error) throw error;
      return data;
    },
  });

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Information</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTechnicianId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Technician</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a technician" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians?.map((technician) => (
                        <SelectItem key={technician.id} value={technician.id}>
                          {technician.first_name} {technician.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Create Booking
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}