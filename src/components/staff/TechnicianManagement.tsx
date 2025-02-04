import { Tabs } from "@/components/ui/tabs";
import { TechnicianFormWrapper } from "./TechnicianFormWrapper";
import { TechnicianTabs } from "./TechnicianTabs";

export function TechnicianManagement() {
  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="roles" className="w-full">
        <TechnicianFormWrapper>
          <TechnicianTabs />
        </TechnicianFormWrapper>
      </Tabs>
    </div>
  );
}