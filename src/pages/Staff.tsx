import { UserPlus, Users, Shield, Settings2, Calendar, LineChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnicianManagement } from "@/components/staff/TechnicianManagement";
import { RoleManagement } from "@/components/staff/RoleManagement";
import { AddStaffMember } from "@/components/staff/AddStaffMember";
import { TechnicianSettings } from "@/components/staff/TechnicianSettings";
import { StaffList } from "@/components/staff/staff-list/StaffList";
import { TimeOffList } from "@/components/staff/time-off/TimeOffList";
import { PerformanceMetrics } from "@/components/staff/performance/PerformanceMetrics";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { technicianSettingsFormSchema, type TechnicianSettingsFormValues } from "@/components/staff/types";
import { Form } from "@/components/ui/form";

export default function Staff() {
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">
          Manage your staff members, roles, and settings efficiently
        </p>
      </div>
      
      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="staff" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Users className="h-4 w-4" />
            Staff Members
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Settings2 className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="time-off" className="flex items-center gap-2 data-[state=active]:bg-background">
            <Calendar className="h-4 w-4" />
            Time Off
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-background">
            <LineChart className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-6">
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