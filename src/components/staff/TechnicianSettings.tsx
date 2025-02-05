
import { FormSectionProps } from "./types";
import { VisibilitySettings } from "./settings/VisibilitySettings";
import { AutoAssignmentSettings } from "./settings/AutoAssignmentSettings";
import { SchedulingSettings } from "./settings/SchedulingSettings";
import { DisplaySettings } from "./settings/DisplaySettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export function TechnicianSettings({ form }: FormSectionProps) {
  const saveSettings = async (values: any) => {
    try {
      console.log("Auto-saving settings:", values);
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

      console.log("Settings saved successfully");
      toast.success("Settings saved automatically");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    }
  };

  // Watch for any form changes and auto-save
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.keys(value).length > 0) {
        saveSettings(value);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <VisibilitySettings form={form} />
        <AutoAssignmentSettings form={form} />
        <SchedulingSettings form={form} />
        <DisplaySettings form={form} />
        <TechnicianSpecialties />
      </div>
    </div>
  );
}
