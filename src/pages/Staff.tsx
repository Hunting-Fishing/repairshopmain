
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { StaffList } from "@/components/staff/StaffList";
import { StaffHeader } from "@/components/staff/components/StaffHeader";
import { StaffTabsList } from "@/components/staff/components/StaffTabsList";
import { useStaffTabs } from "@/components/staff/hooks/useStaffTabs";
import { RoleManagement } from "@/components/staff/RoleManagement";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TechnicianSettings } from "@/components/staff/TechnicianSettings";

export default function Staff() {
  const form = useStaffTabs();
  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <StaffHeader />
          <Tabs defaultValue="staff" className="space-y-6">
            <StaffTabsList />
            <TabsContent value="staff">
              <StaffList />
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
            <TabsContent value="settings">
              <Form {...form}>
                <form className="space-y-8">
                  <TechnicianSettings form={form} />
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <RoleManagement 
        isOpen={isRoleManagementOpen} 
        onClose={() => setIsRoleManagementOpen(false)} 
      />
    </div>
  );
}
