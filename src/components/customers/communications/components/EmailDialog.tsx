
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "./RichTextEditor";
import { TemplateSelectionDialog } from "./TemplateSelectionDialog";
import { useState } from "react";
import { format } from "date-fns";
import type { EmailTemplate } from "../types";

interface EmailDialogProps {
  customerId: string;
  customerEmail?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SendEmailFormData {
  to: string;
  subject: string;
  content: string;
}

export function EmailDialog({ customerId, customerEmail, isOpen, onOpenChange }: EmailDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<SendEmailFormData>();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();

  const sendEmailMutation = useMutation({
    mutationFn: async (data: SendEmailFormData) => {
      if (isScheduled && scheduledDate) {
        // Schedule the email
        const { error } = await supabase
          .from('scheduled_communications')
          .insert({
            customer_id: customerId,
            type: 'email',
            subject: data.subject,
            content: data.content,
            scheduled_for: scheduledDate.toISOString(),
            created_by: (await supabase.auth.getUser()).data.user?.id,
          });

        if (error) throw error;
        return { scheduled: true };
      } else {
        // Send immediately
        const response = await supabase.functions.invoke('send-email', {
          body: {
            to: data.to,
            subject: data.subject,
            content: data.content,
            customerId,
          },
        });

        if (response.error) throw response.error;
        return response.data;
      }
    },
    onSuccess: (data) => {
      if (data.scheduled) {
        toast.success("Email scheduled successfully");
      } else {
        toast.success("Email sent successfully");
      }
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["communications", customerId] });
    },
    onError: (error) => {
      toast.error(`Failed to ${isScheduled ? 'schedule' : 'send'} email: ${error.message}`);
    },
  });

  const handleSendEmail = form.handleSubmit((data) => {
    if (isScheduled && !scheduledDate) {
      toast.error("Please select a date to schedule the email");
      return;
    }
    sendEmailMutation.mutate(data);
  });

  const handleTemplateSelect = (template: EmailTemplate) => {
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
            <div className="flex items-center space-x-2">
              <Switch
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
                id="schedule-email"
              />
              <Label htmlFor="schedule-email">Schedule Email</Label>
            </div>
          </div>

          {isScheduled && (
            <div className="flex flex-col space-y-2">
              <Label>Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!scheduledDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              {...form.register("to")}
              defaultValue={customerEmail}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...form.register("subject")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <RichTextEditor
              content={form.watch("content") || ""}
              onChange={(content) => form.setValue("content", content)}
              onVariableSelect={(variable) => {
                const editor = form.getValues("content");
                form.setValue("content", editor + " " + variable);
              }}
              availableVariables={[
                "{{customer_name}}",
                "{{customer_email}}",
                "{{customer_phone}}"
              ]}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={sendEmailMutation.isPending}
          >
            {sendEmailMutation.isPending 
              ? (isScheduled ? "Scheduling..." : "Sending...") 
              : (isScheduled ? "Schedule Email" : "Send Email")}
          </Button>
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
