import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleManagement } from "./RoleManagement";
import { TechnicianSettings } from "./TechnicianSettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";
import { TrainingRecords } from "./training/TrainingRecords";
import { AssignmentRules } from "./assignment-rules/AssignmentRules";
import { UseFormReturn } from "react-hook-form";
import { TechnicianSettingsFormValues } from "./types";
import { SkillCategories } from "./skills/SkillCategories";

interface TechnicianTabsProps {
  form: UseFormReturn<TechnicianSettingsFormValues>;
}

export function TechnicianTabs({ form }: TechnicianTabsProps) {
  return (
    <>
      <TabsList className="grid w-full grid-cols-6 mb-8">
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="specialties">Specialties</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
        <TabsTrigger value="assignment-rules">Assignment Rules</TabsTrigger>
      </TabsList>

      <TabsContent value="roles">
        <RoleManagement />
      </TabsContent>

      <TabsContent value="settings">
        <TechnicianSettings form={form} />
      </TabsContent>

      <TabsContent value="specialties">
        <TechnicianSpecialties />
      </TabsContent>

      <TabsContent value="skills">
        <SkillCategories />
      </TabsContent>

      <TabsContent value="training">
        <TrainingRecords />
      </TabsContent>

      <TabsContent value="assignment-rules">
        <AssignmentRules />
      </TabsContent>
    </>
  );
}