
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SendEmailFormData } from "./types";

interface UseEmailSendProps {
  customerId: string;
  onSuccess: () => void;
  isScheduled: boolean;
  scheduledDate?: Date;
}

export function useEmailSend({ 
  customerId, 
  onSuccess, 
  isScheduled, 
  scheduledDate 
}: UseEmailSendProps) {
  const queryClient = useQueryClient();

  return useMutation({
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
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ["communications", customerId] });
    },
    onError: (error) => {
      toast.error(`Failed to ${isScheduled ? 'schedule' : 'send'} email: ${error.message}`);
    },
  });
}
