
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TemplateSelectionDialog } from "../TemplateSelectionDialog";
import { useState } from "react";
import { EmailDialogProps, SendEmailFormData } from "./types";
import { SchedulingSection } from "./SchedulingSection";
import { EmailForm } from "./EmailForm";
import { useEmailSend } from "./useEmailSend";

export function EmailDialog({ customerId, customerEmail, isOpen, onOpenChange }: EmailDialogProps) {
  const form = useForm<SendEmailFormData>();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();

  const sendEmailMutation = useEmailSend({
    customerId,
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
    },
    isScheduled,
    scheduledDate,
  });

  const handleSendEmail = form.handleSubmit((data) => {
    if (isScheduled && !scheduledDate) {
      toast.error("Please select a date to schedule the email");
      return;
    }
    sendEmailMutation.mutate(data);
  });

  const handleTemplateSelect = (template: any) => {
    form.setValue('subject', template.subject);
    form.setValue('content', template.content);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
            >
              Use Template
            </Button>
            <SchedulingSection
              isScheduled={isScheduled}
              setIsScheduled={setIsScheduled}
              scheduledDate={scheduledDate}
              setScheduledDate={setScheduledDate}
            />
          </div>

          <EmailForm
            form={form}
            isScheduled={isScheduled}
            isPending={sendEmailMutation.isPending}
            customerEmail={customerEmail}
          />
        </form>
      </DialogContent>
      <TemplateSelectionDialog
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSelect={handleTemplateSelect}
      />
    </Dialog>
  );
}
