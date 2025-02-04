import { Box } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SupplierHeader } from "./supplier-card/SupplierHeader";
import { SupplierFeatures } from "./supplier-card/SupplierFeatures";
import { SupplierStats } from "./supplier-card/SupplierStats";
import { SupplierContact } from "./supplier-card/SupplierContact";
import { SupplierFinancials } from "./supplier-details/SupplierFinancials";
import { SupplierDocuments } from "./supplier-details/SupplierDocuments";
import { SupplierTransactions } from "./supplier-details/SupplierTransactions";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
            <Box className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0 space-y-6">
            <SupplierHeader supplier={supplier} />
            <SupplierFeatures />
            <SupplierStats />
            <SupplierContact supplier={supplier} />
            <SupplierFinancials supplier={supplier} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SupplierDocuments supplier={supplier} />
              <SupplierTransactions supplier={supplier} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}