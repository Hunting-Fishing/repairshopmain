import { DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSupplierTransactions } from "../hooks/useSupplierTransactions";
import type { InventorySupplier } from "../../../types";

interface SupplierTransactionsProps {
  supplier: InventorySupplier;
}

export function SupplierTransactions({ supplier }: SupplierTransactionsProps) {
  const { transactions, isLoading } = useSupplierTransactions(supplier.id);

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
        ) : transactions?.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No transactions found</div>
        ) : (
          <div className="space-y-4">
            {transactions?.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center gap-4">
                  {transaction.transaction_type === 'payment' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{transaction.transaction_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${transaction.amount}</p>
                  <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
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