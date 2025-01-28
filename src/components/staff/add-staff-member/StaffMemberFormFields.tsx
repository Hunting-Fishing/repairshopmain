import { UseFormReturn } from "react-hook-form";
import { StaffMemberFormValues } from "./schema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomRole } from "../role-management/types";

interface StaffMemberFormFieldsProps {
  form: UseFormReturn<StaffMemberFormValues>;
  customRoles: CustomRole[];
}

export function StaffMemberFormFields({ form, customRoles }: StaffMemberFormFieldsProps) {
  const selectedRole = form.watch("role");

  return (
    <>
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
                {customRoles.length > 0 && (
                  <>
                    <SelectItem value="custom">Custom Role</SelectItem>
                    {customRoles.map((role) => (
                      <SelectItem key={role.id} value={`custom_${role.id}`}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {selectedRole === "custom" && (
        <FormField
          control={form.control}
          name="customRoleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Custom Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a custom role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}