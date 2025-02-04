import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationFormSchema } from "./schema";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { CertificationFormFields } from "./form/CertificationFormFields";
import { CertificationDateFields } from "./form/CertificationDateFields";

interface CertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId?: string;
}

export function CertificationDialog({ open, onOpenChange, profileId }: CertificationDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(certificationFormSchema),
    defaultValues: {
      name: "",
      issuer: "",
      issue_date: undefined,
      expiry_date: undefined,
    },
  });

  const onSubmit = async (values: any) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) return;

    const { error } = await supabase
      .from("staff_certifications")
      .insert({
        ...values,
        profile_id: profileId,
      });

    if (error) {
      toast({
        title: "Error creating certification",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Create reminder if expiry date is set
    if (values.expiry_date) {
      const reminderDate = new Date(values.expiry_date);
      reminderDate.setMonth(reminderDate.getMonth() - 1); // Remind 1 month before expiry

      await supabase
        .from("staff_certification_reminders")
        .insert({
          profile_id: profileId,
          certification_id: values.id,
          reminder_date: reminderDate.toISOString(),
          reminder_type: "expiry",
        });
    }

    toast({
      title: "Certification added",
      description: "The certification has been added successfully.",
    });
    
    queryClient.invalidateQueries({ queryKey: ["staff-certifications"] });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Certification</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CertificationFormFields />
            <CertificationDateFields />
            <DialogFooter>
              <Button type="submit">Add Certification</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}