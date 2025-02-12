
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCommunications(customerId: string) {
  return useQuery({
    queryKey: ["communications", customerId],
    queryFn: async () => {
      const [messagesResponse, smsResponse] = await Promise.all([
        supabase
          .from("customer_communications")
          .select(`
            *,
            sender:profiles(first_name, last_name)
          `)
          .eq("customer_id", customerId)
          .order("sent_at", { ascending: false }),
        supabase
          .from("sms_messages")
          .select("*")
          .eq("customer_id", customerId)
          .order("sent_at", { ascending: false })
      ]);

      if (messagesResponse.error) throw messagesResponse.error;
      if (smsResponse.error) throw smsResponse.error;

      return {
        messages: messagesResponse.data,
        sms: smsResponse.data
      };
    },
  });
}
