import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useUpdateStaffMember } from "@/hooks/staff/useUpdateStaffMember";
import { type StaffMember } from "@/types/staff";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { ContactFields } from "./form-sections/ContactFields";
import { EmergencyContactFields } from "./form-sections/EmergencyContactFields";
import { NotesField } from "./form-sections/NotesField";
import { staffDetailsSchema } from "./schema";
import type { StaffDetailsFormValues } from "./types";
import { CertificationList } from "../certifications/CertificationList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StaffDetailsFormProps {
  staffMember: StaffMember;
  onClose: () => void;
}

export function StaffDetailsForm({ staffMember, onClose }: StaffDetailsFormProps) {
  const { updateStaffMember, isLoading } = useUpdateStaffMember();

  const form = useForm<StaffDetailsFormValues>({
    resolver: zodResolver(staffDetailsSchema),
    defaultValues: {
      first_name: staffMember.first_name || "",
      last_name: staffMember.last_name || "",
      email: staffMember.email || "",
      phone_number: staffMember.phone_number || "",
      notes: staffMember.notes || "",
      emergency_contact: staffMember.emergency_contact || {
        name: "",
        phone: "",
        relationship: "",
      },
      skills: staffMember.skills || [],
    },
  });

  const onSubmit = async (values: StaffDetailsFormValues) => {
    await updateStaffMember({
      id: staffMember.id,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_number: values.phone_number,
      notes: values.notes,
      emergency_contact: values.emergency_contact,
      skills: values.skills,
    });
    onClose();
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
            <PersonalInfoFields form={form} />
            <ContactFields form={form} />
            <EmergencyContactFields form={form} />
            <NotesField form={form} />
            
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