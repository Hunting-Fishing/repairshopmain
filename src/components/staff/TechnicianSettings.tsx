
import { FormSectionProps } from "./types";
import { VisibilitySettings } from "./settings/VisibilitySettings";
import { AutoAssignmentSettings } from "./settings/AutoAssignmentSettings";
import { SchedulingSettings } from "./settings/SchedulingSettings";
import { DisplaySettings } from "./settings/DisplaySettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function TechnicianSettings({ form }: FormSectionProps) {
  const onSubmit = async (values: any) => {
    try {
      console.log("Submitting settings:", values);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to save settings");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          technician_settings: values
        })
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success("Settings saved successfully");
      console.log("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <VisibilitySettings form={form} />
          <AutoAssignmentSettings form={form} />
          <SchedulingSettings form={form} />
          <DisplaySettings form={form} />
          <TechnicianSpecialties />
        </div>
        <Button type="submit" className="mt-6">Save Settings</Button>
      </form>
    </div>
  );
}
