import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomRoleDialog } from "./role-management/CustomRoleDialog";
import { StaffMemberFormFields } from "./add-staff-member/StaffMemberFormFields";
import { staffMemberSchema, type StaffMemberFormValues } from "./add-staff-member/schema";
import { useAddStaffMember } from "@/hooks/staff/useAddStaffMember";

export function AddStaffMember() {
  const { addStaffMember, isLoading } = useAddStaffMember();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: customRoles = [] } = useQuery({
    queryKey: ["custom-roles", userProfile?.organization_id],
    queryFn: async () => {
      if (!userProfile?.organization_id) return [];

      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq('organization_id', userProfile.organization_id);

      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.organization_id,
  });

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
    if (!userProfile?.organization_id) {
      toast.error("Organization not found");
      return;
    }

    const success = await addStaffMember(data, userProfile.organization_id);
    if (success) {
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add Staff Member
        </CardTitle>
        <CardDescription>
          Add a new staff member to your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StaffMemberFormFields form={form} customRoles={customRoles} />
            <div className="flex justify-end">
              <CustomRoleDialog />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Staff Member"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}