
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateStaffMember } from "@/hooks/staff/useUpdateStaffMember";
import { CertificationList } from "../certifications/CertificationList";
import { staffDetailsSchema } from "./schema";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { EmergencyContactSection } from "./sections/EmergencyContactSection";
import { NotesSection } from "./sections/NotesSection";
import type { StaffDetailsFormProps, StaffDetailsFormValues, StaffMemberData } from "./types";
import { toast } from "sonner";

export function StaffDetailsForm({ staffMember, onClose }: StaffDetailsFormProps) {
  const { updateStaffMember, isLoading } = useUpdateStaffMember();

  const form = useForm<StaffDetailsFormValues>({
    resolver: zodResolver(staffDetailsSchema),
    defaultValues: {
      first_name: staffMember.first_name ?? null,
      last_name: staffMember.last_name ?? null,
      email: staffMember.email ?? null,
      phone_number: staffMember.phone_number ?? null,
      notes: staffMember.notes ?? null,
      emergency_contact: staffMember.emergency_contact ?? null,
      skills: staffMember.skills
    },
  });

  const onSubmit = async (values: StaffDetailsFormValues) => {
    try {
      const updateData: StaffMemberData = {
        id: staffMember.id,
        first_name: values.first_name ?? null,
        last_name: values.last_name ?? null,
        email: values.email ?? null,
        phone_number: values.phone_number ?? null,
        notes: values.notes ?? null,
        emergency_contact: values.emergency_contact ?? null,
        skills: values.skills ?? []
      };

      await updateStaffMember(staffMember.id, updateData);
      toast.success("Staff member updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update staff member");
      console.error(error);
    }
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoSection />
            <EmergencyContactSection />
            <NotesSection />
            
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="certifications">
        <CertificationList profileId={staffMember.id} />
      </TabsContent>
    </Tabs>
  );
}
