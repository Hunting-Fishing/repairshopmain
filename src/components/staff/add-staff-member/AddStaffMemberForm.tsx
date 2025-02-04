import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StaffMemberFormFields } from "./StaffMemberFormFields";
import { staffMemberSchema, type StaffMemberFormValues } from "./schema";
import { useAddStaffMember } from "@/hooks/staff/useAddStaffMember";
import type { CustomRole } from "../role-management/types";
import { DialogClose } from "@/components/ui/dialog";
import { useRef } from "react";

interface AddStaffMemberFormProps {
  organizationId: string;
  customRoles: CustomRole[];
}

export function AddStaffMemberForm({ organizationId, customRoles }: AddStaffMemberFormProps) {
  const { addStaffMember, isLoading } = useAddStaffMember();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
      closeButtonRef.current?.click();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <StaffMemberFormFields form={form} customRoles={customRoles} />
        <div className="flex justify-end gap-2 pt-4">
          <DialogClose ref={closeButtonRef} asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Staff Member"}
          </Button>
        </div>
      </form>
    </Form>
  );
}