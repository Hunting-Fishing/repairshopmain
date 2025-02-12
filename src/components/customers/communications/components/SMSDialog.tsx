
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SMSDialogProps {
  customerId: string;
  customerPhoneNumber?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SendSMSFormData {
  phoneNumber: string;
  message: string;
}

export function SMSDialog({ customerId, customerPhoneNumber, isOpen, onOpenChange }: SMSDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<SendSMSFormData>();

  const sendSMSMutation = useMutation({
    mutationFn: async (data: SendSMSFormData) => {
      const response = await supabase.functions.invoke('send-sms', {
        body: {
          to: data.phoneNumber,
          content: data.message,
          customerId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("SMS sent successfully");
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["communications", customerId] });
    },
    onError: (error) => {
      toast.error(`Failed to send SMS: ${error.message}`);
    },
  });

  const handleSendSMS = form.handleSubmit((data) => {
    sendSMSMutation.mutate(data);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" />
          Send SMS
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send SMS Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendSMS} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              {...form.register("phoneNumber")}
              defaultValue={customerPhoneNumber}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...form.register("message")}
              rows={4}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={sendSMSMutation.isPending}
          >
            {sendSMSMutation.isPending ? "Sending..." : "Send SMS"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
