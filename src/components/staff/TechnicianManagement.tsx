
import { Tabs } from "@/components/ui/tabs";
import { TechnicianFormWrapper } from "./TechnicianFormWrapper";
import { TechnicianTabs } from "./TechnicianTabs";
import { UseFormReturn } from "react-hook-form";
import { TechnicianSettingsFormValues } from "./types";

export function TechnicianManagement() {
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="roles" className="w-full">
        <TechnicianFormWrapper>
          {(form: UseFormReturn<TechnicianSettingsFormValues>) => (
            <TechnicianTabs form={form} />
          )}
        </TechnicianFormWrapper>
      </Tabs>
    </div>
  );
}
