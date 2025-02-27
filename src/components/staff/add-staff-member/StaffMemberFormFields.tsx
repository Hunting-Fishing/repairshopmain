
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { RoleFields } from "./form-sections/RoleFields";
import { AdditionalFields } from "./form-sections/AdditionalFields";
import { StaffMemberFormValues } from "./schema";
import type { CustomRole } from "../role-management/types";

interface StaffMemberFormFieldsProps {
  form: UseFormReturn<StaffMemberFormValues>;
  customRoles: CustomRole[];
}

export function StaffMemberFormFields({ form, customRoles }: StaffMemberFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Personal Information */}
      <PersonalInfoFields form={form} />
      
      {/* Role */}
      <RoleFields form={form} customRoles={customRoles} />
      
      {/* Additional Information */}
      <AdditionalFields form={form} />
    </div>
  );
}
