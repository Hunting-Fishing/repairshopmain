import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnicianSettings } from "./TechnicianSettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";
import { RoleManagement } from "./RoleManagement";
import { TrainingRecords } from "./training/TrainingRecords";
import { technicianSettingsFormSchema, type TechnicianSettingsFormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

export function TechnicianManagement() {
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
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="roles">
              <RoleManagement />
            </TabsContent>

            <TabsContent value="settings">
              <TechnicianSettings form={form} />
            </TabsContent>

            <TabsContent value="specialties">
              <TechnicianSpecialties />
            </TabsContent>

            <TabsContent value="training">
              <TrainingRecords />
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}