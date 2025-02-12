
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendEmail} className="space-y-4">
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
            <Textarea
              id="content"
              {...form.register("content")}
              rows={6}
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
    </Dialog>
  );
}
