
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useNotificationRecipients(templateId: string) {
  const queryClient = useQueryClient();

  const { data: recipients = [], isLoading } = useQuery({
    queryKey: ["notification-recipients", templateId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_recipients")
        .select("recipient_id, notification_types")
        .eq("template_id", templateId);

      if (error) throw error;
      return data;
    },
    enabled: !!templateId,
  });

  const updateRecipients = useMutation({
    mutationFn: async (newRecipients: string[]) => {
      // Get organization_id
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("organization_id")
        .single();

      if (!userProfile?.organization_id) {
        throw new Error("No organization found");
      }

      // Delete existing recipients
      const { error: deleteError } = await supabase
        .from("notification_recipients")
        .delete()
        .eq("template_id", templateId);

      if (deleteError) throw deleteError;

      // Insert new recipients
      if (newRecipients.length > 0) {
        const { error: insertError } = await supabase
          .from("notification_recipients")
          .insert(
            newRecipients.map((recipientId) => ({
              template_id: templateId,
              recipient_id: recipientId,
              organization_id: userProfile.organization_id,
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-recipients", templateId] });
      toast.success("Notification recipients updated");
    },
    onError: (error) => {
      console.error("Error updating recipients:", error);
      toast.error("Failed to update notification recipients");
    },
  });

  return {
    recipients: recipients.map((r) => r.recipient_id),
    isLoading,
    updateRecipients,
  };
}
