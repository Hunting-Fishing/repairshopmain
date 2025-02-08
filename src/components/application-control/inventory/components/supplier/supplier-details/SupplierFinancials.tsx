import { DollarSign, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../../types/base";

interface SupplierFinancialsProps {
  supplier: InventorySupplier;
}

export function SupplierFinancials({ supplier }: SupplierFinancialsProps) {
  const paymentTerms = supplier.payment_terms as { type: string; discount: number | null };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Payment Terms</p>
            <p className="font-medium">{paymentTerms?.type || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Credit Limit</p>
            <p className="font-medium">${supplier.credit_limit || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>{supplier.payment_method || 'Not set'}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            <Badge variant={supplier.payment_status === 'active' ? 'default' : 'destructive'}>
              {supplier.payment_status || 'Unknown'}
            </Badge>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Last Payment</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{supplier.last_payment_date ? new Date(supplier.last_payment_date).toLocaleDateString() : 'No payments'}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="font-medium text-lg">${supplier.total_spent || 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
