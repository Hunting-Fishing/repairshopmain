
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "./RichTextEditor";
import { TemplateSelectionDialog } from "./TemplateSelectionDialog";
import { useState } from "react";
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

  const sendEmailMutation = useMutation({
    mutationFn: async (data: SendEmailFormData) => {
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: data.to,
          subject: data.subject,
          content: data.content,
          customerId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Email sent successfully");
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["communications", customerId] });
    },
    onError: (error) => {
      toast.error(`Failed to send email: ${error.message}`);
    },
  });

  const handleSendEmail = form.handleSubmit((data) => {
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
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(true)}
            >
              Use Template
            </Button>
          </div>
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
            {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
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
