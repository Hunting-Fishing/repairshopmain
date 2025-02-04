import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { RoleManagement } from "@/components/staff/RoleManagement";
import { AddStaffMember } from "@/components/staff/AddStaffMember";
import { TechnicianSettings } from "@/components/staff/TechnicianSettings";
import { StaffList } from "@/components/staff/staff-list/StaffList";
import { TimeOffList } from "@/components/staff/time-off/TimeOffList";
import { PerformanceMetrics } from "@/components/staff/performance/PerformanceMetrics";
import { AssignmentRules } from "@/components/staff/assignment-rules/AssignmentRules";
import { StaffHeader } from "@/components/staff/components/StaffHeader";
import { StaffTabsList } from "@/components/staff/components/StaffTabsList";
import { useStaffTabs } from "@/components/staff/hooks/useStaffTabs";

export default function Staff() {
  const form = useStaffTabs();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <StaffHeader />
      <Tabs defaultValue="staff" className="space-y-6">
        <StaffTabsList />
        <TabsContent value="staff">
          <AddStaffMember />
          <StaffList />
        </TabsContent>
        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
        <TabsContent value="settings">
          <Form {...form}>
            <form className="space-y-8">
              <TechnicianSettings form={form} />
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="assignment-rules">
          <AssignmentRules />
        </TabsContent>
        <TabsContent value="time-off">
          <TimeOffList />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}