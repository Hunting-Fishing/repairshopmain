import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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

export function AddStaffMember() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: customRoles = [] } = useQuery({
    queryKey: ["custom-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // Get organization_id from membership
      const { data: memberData, error: memberError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (memberError) throw memberError;

      const { data, error } = await supabase
        .from("custom_roles")
        .select("*")
        .eq('organization_id', memberData.organization_id);

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<StaffMemberFormValues>({
    resolver: zodResolver(staffMemberSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      role: "technician",
    },
  });

  const onSubmit = async (data: StaffMemberFormValues) => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      // Get organization_id from membership
      const { data: memberData, error: memberError } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (memberError) throw memberError;

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: Math.random().toString(36).slice(-8),
        email_confirm: true,
      });

      if (authError) throw authError;

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          organization_id: memberData.organization_id,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
          custom_role_id: data.role === "custom" ? data.customRoleId : null,
        });

      if (profileError) throw profileError;

      // Add organization membership
      const { error: membershipError } = await supabase
        .from("organization_members")
        .insert({
          organization_id: memberData.organization_id,
          user_id: authData.user.id,
          status: 'active'
        });

      if (membershipError) throw membershipError;

      toast.success("Staff member added successfully");
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });
      form.reset();
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast.error("Failed to add staff member");
    } finally {
      setIsLoading(false);
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