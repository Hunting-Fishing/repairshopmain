import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const staffMemberSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["technician", "service_advisor", "management", "parts", "hr"]),
});

type StaffMemberFormValues = z.infer<typeof staffMemberSchema>;

export function AddStaffMember() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

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

      // First create the user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.email,
        password: Math.random().toString(36).slice(-8), // Generate a random password
        email_confirm: true,
      });

      if (authError) throw authError;

      // Then create their profile
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          organization_id: session.user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
        });

      if (profileError) throw profileError;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="service_advisor">Service Advisor</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="parts">Parts</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Staff Member"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}