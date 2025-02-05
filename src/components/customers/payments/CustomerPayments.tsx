
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface CustomerPaymentsProps {
  customerId: string;
}

export function CustomerPayments({ customerId }: CustomerPaymentsProps) {
  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_payments")
        .select(`
          *,
          repair_job:customer_repair_jobs(description)
        `)
        .eq("customer_id", customerId)
        .order("payment_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-500",
      pending: "bg-yellow-500",
      failed: "bg-red-500",
      refunded: "bg-blue-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  if (isLoading) return <div>Loading payments...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Payments</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <div className="grid gap-4">
        {payments?.map((payment) => (
          <Card key={payment.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {formatCurrency(payment.amount)}
              </CardTitle>
              <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">
                  Date: {format(new Date(payment.payment_date), "PPp")}
                </div>
                <div className="text-sm text-muted-foreground">
                  Method: {payment.payment_method}
                </div>
                {payment.repair_job && (
                  <div className="text-sm text-muted-foreground">
                    For: {payment.repair_job.description}
                  </div>
                )}
                {payment.transaction_id && (
                  <div className="text-sm text-muted-foreground">
                    Transaction ID: {payment.transaction_id}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
