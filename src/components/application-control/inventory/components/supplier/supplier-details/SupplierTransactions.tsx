import { DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupplierTransactions } from "../hooks/useSupplierTransactions";
import type { InventorySupplier } from "../../../types/supplier";

interface SupplierTransactionsProps {
  supplier: InventorySupplier;
}

export function SupplierTransactions({ supplier }: SupplierTransactionsProps) {
  const { transactions, isLoading } = useSupplierTransactions(supplier.id);

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading transactions...</div>
        ) : !transactions?.length ? (
          <div className="text-center py-4 text-muted-foreground">No transactions found</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-4">
                  {transaction.transaction_type === 'payment' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium capitalize">{transaction.transaction_type}</p>
                      {transaction.reference_number && (
                        <span className="text-sm text-muted-foreground">
                          #{transaction.reference_number}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                      {transaction.payment_method && (
                        <span>• {transaction.payment_method}</span>
                      )}
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{transaction.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.currency} {transaction.amount.toFixed(2)}
                  </p>
                  <Badge variant={getBadgeVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
