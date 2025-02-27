
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { TechnicianSettings } from "./TechnicianSettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";
import { TechnicianAvailability } from "./TechnicianAvailability";
import { TechnicianHeader } from "./components/TechnicianHeader";
import { TechnicianTabsList } from "./components/TechnicianTabsList";
import { useTechnicianTabs } from "./hooks/useTechnicianTabs";
import { RoleManagement } from "../RoleManagement";

export default function TechnicianTabs() {
  const form = useTechnicianTabs();
  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <TechnicianHeader />
      <Tabs defaultValue="settings" className="space-y-6">
        <TechnicianTabsList />
        <TabsContent value="settings">
          <Form {...form}>
            <form className="space-y-8">
              <TechnicianSettings form={form} />
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="specialties">
          <TechnicianSpecialties />
        </TabsContent>
        <TabsContent value="availability">
          <TechnicianAvailability />
        </TabsContent>
        <TabsContent value="roles">
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setIsRoleManagementOpen(true)}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Manage Roles
            </button>
          </div>
          <div className="text-center text-muted-foreground py-8">
            Role assignments will be displayed here
          </div>
        </TabsContent>
      </Tabs>
      
      <RoleManagement 
        isOpen={isRoleManagementOpen} 
        onClose={() => setIsRoleManagementOpen(false)} 
      />
    </div>
  );
}
