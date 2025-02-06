
import { UseFormReturn } from "react-hook-form";
import { StaffMemberFormValues } from "./schema";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { ContactFields } from "./form-sections/ContactFields";
import { RoleFields } from "./form-sections/RoleFields";
import { AdditionalFields } from "./form-sections/AdditionalFields";
import { CustomRole } from "../role-management/types";

interface StaffMemberFormFieldsProps {
  form: UseFormReturn<StaffMemberFormValues>;
  customRoles: CustomRole[];
}

export function StaffMemberFormFields({ form, customRoles }: StaffMemberFormFieldsProps) {
  return (
    <div className="space-y-6">
      <PersonalInfoFields form={form} />
      <ContactFields form={form} />
      <RoleFields form={form} customRoles={customRoles} />
      <AdditionalFields form={form} />
    </div>
  );
}
