import { useQuery } from "@tanstack/react-query";
import { CustomerHistoryList } from "../history/CustomerHistoryList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface HistoryTabProps {
  customerId?: string;
}

export function HistoryTab({ customerId }: HistoryTabProps) {
  const { data: customer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      if (!customerId) return null;
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!customerId,
  });

  if (!customerId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer History</CardTitle>
          <CardDescription>
            Select a customer to view their history
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer History</CardTitle>
        <CardDescription>
          View the history of changes for {customer?.first_name} {customer?.last_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CustomerHistoryList customerId={customerId} />
      </CardContent>
    </Card>
  );
}