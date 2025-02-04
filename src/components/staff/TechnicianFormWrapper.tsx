import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { technicianSettingsFormSchema, type TechnicianSettingsFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

interface TechnicianFormWrapperProps {
  children: React.ReactNode;
}

export function TechnicianFormWrapper({ children }: TechnicianFormWrapperProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<TechnicianSettingsFormValues>({
    resolver: zodResolver(technicianSettingsFormSchema),
    defaultValues: {
      showTechnicianWorkload: false,
      showTechnicianAvailability: false,
      showTechnicianStats: false,
      enableAutoAssignment: false,
      enableTechnicianSpecialties: false,
      technicianScheduleConflictHandling: "warn",
      enableTechnicianColors: false,
      technicianViewMode: "individual",
      maxDailyBookings: 8,
      preferredWorkTypes: [],
      autoAssignmentPreferences: {
        considerSpecialties: true,
        considerWorkload: true,
        considerLocation: false,
      },
    },
  });

  async function onSubmit(values: TechnicianSettingsFormValues) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to save settings",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          technician_settings: values
        })
        .eq('id', session.user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["technician-settings"] });

      toast({
        title: "Settings updated",
        description: "Your technician settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {typeof children === 'function' ? children(form) : children}
      </form>
    </Form>
  );
}