import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleManagement } from "./RoleManagement";
import { TechnicianSettings } from "./TechnicianSettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";
import { TrainingRecords } from "./training/TrainingRecords";
import { AssignmentRules } from "./assignment-rules/AssignmentRules";
import { UseFormReturn } from "react-hook-form";
import { TechnicianSettingsFormValues } from "./types";
import { SkillCategories } from "./skills/SkillCategories";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TechnicianTabsProps {
  form: UseFormReturn<TechnicianSettingsFormValues>;
}

export function TechnicianTabs({ form }: TechnicianTabsProps) {
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, custom_role_id')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        toast.error("Failed to fetch user role");
        throw profileError;
      }

      const { data: permissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq(profile.custom_role_id ? 'custom_role_id' : 'role_type', 
             profile.custom_role_id || profile.role);

      if (permissionsError) {
        toast.error("Failed to fetch permissions");
        throw permissionsError;
      }

      return permissions.map(p => p.permission);
    }
  });

  const canViewRoles = userPermissions?.includes('view_roles');
  const canViewSettings = userPermissions?.includes('manage_staff');
  const canViewSpecialties = userPermissions?.includes('view_skills');
  const canViewSkills = userPermissions?.includes('view_skills');
  const canViewTraining = userPermissions?.includes('view_training');
  const canViewAssignments = userPermissions?.includes('view_assignments');

  return (
    <>
      <TabsList className="grid w-full grid-cols-6 mb-8">
        {canViewRoles && <TabsTrigger value="roles">Roles</TabsTrigger>}
        {canViewSettings && <TabsTrigger value="settings">Settings</TabsTrigger>}
        {canViewSpecialties && <TabsTrigger value="specialties">Specialties</TabsTrigger>}
        {canViewSkills && <TabsTrigger value="skills">Skills</TabsTrigger>}
        {canViewTraining && <TabsTrigger value="training">Training</TabsTrigger>}
        {canViewAssignments && <TabsTrigger value="assignment-rules">Assignment Rules</TabsTrigger>}
      </TabsList>

      {canViewRoles && (
        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>
      )}

      {canViewSettings && (
        <TabsContent value="settings">
          <TechnicianSettings form={form} />
        </TabsContent>
      )}

      {canViewSpecialties && (
        <TabsContent value="specialties">
          <TechnicianSpecialties />
        </TabsContent>
      )}

      {canViewSkills && (
        <TabsContent value="skills">
          <SkillCategories />
        </TabsContent>
      )}

      {canViewTraining && (
        <TabsContent value="training">
          <TrainingRecords />
        </TabsContent>
      )}

      {canViewAssignments && (
        <TabsContent value="assignment-rules">
          <AssignmentRules />
        </TabsContent>
      )}
    </>
  );
}