import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StaffMemberFormFields } from "./StaffMemberFormFields";
import { staffMemberSchema, type StaffMemberFormValues } from "./schema";
import { useAddStaffMember } from "@/hooks/staff/useAddStaffMember";
import type { CustomRole } from "../role-management/types";

interface AddStaffMemberFormProps {
  organizationId: string;
  customRoles: CustomRole[];
}

export function AddStaffMemberForm({ organizationId, customRoles }: AddStaffMemberFormProps) {
  const { addStaffMember, isLoading } = useAddStaffMember();

  const form = useForm<StaffMemberFormValues>({
    resolver: zodResolver(staffMemberSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "technician",
      phoneNumber: "",
      notes: "",
    },
  });

  const onSubmit = async (data: StaffMemberFormValues) => {
    const success = await addStaffMember(data, organizationId);
    if (success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <StaffMemberFormFields form={form} customRoles={customRoles} />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Staff Member"}
        </Button>
      </form>
    </Form>
  );
}