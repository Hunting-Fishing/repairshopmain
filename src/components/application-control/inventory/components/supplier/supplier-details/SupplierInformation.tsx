import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, User, Building, CreditCard, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { InventorySupplier } from "../../../types";
import { formatDate } from "@/lib/utils";

interface SupplierInformationProps {
  supplier: InventorySupplier;
}

export function SupplierInformation({ supplier }: SupplierInformationProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-2">
                {supplier.contact_person && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.contact_person}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.phone}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Details</h3>
              <div className="space-y-2">
                {supplier.tax_id && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Tax ID: {supplier.tax_id}</span>
                  </div>
                )}
                {supplier.payment_method && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Payment Method: {supplier.payment_method}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant={supplier.status === 'active' ? "default" : "destructive"}>
                    {supplier.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Credit Limit:</span>
                  <span className="text-sm">${supplier.credit_limit?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Spent:</span>
                  <span className="text-sm">${supplier.total_spent?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Currency:</span>
                  <span className="text-sm">{supplier.currency || 'USD'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reliability Score:</span>
                  <span className="text-sm">{supplier.reliability_score?.toFixed(1) || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fulfillment Rate:</span>
                  <span className="text-sm">{supplier.fulfillment_rate?.toFixed(1)}%</span>
                </div>
                {supplier.last_order_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Order:</span>
                    <span className="text-sm">{formatDate(supplier.last_order_date)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {supplier.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{supplier.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}