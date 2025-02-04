import { Card } from "@/components/ui/card";
import { SupplierHeader } from "./supplier-card/SupplierHeader";
import { SupplierContact } from "./supplier-card/SupplierContact";
import { SupplierFeatures } from "./supplier-card/SupplierFeatures";
import { SupplierStats } from "./supplier-card/SupplierStats";
import { SupplierActions } from "./supplier-card/SupplierActions";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
  onClick?: (supplier: InventorySupplier) => void;
}

export function SupplierCard({ supplier, onClick }: SupplierCardProps) {
  return (
    <Card 
      className="p-6 space-y-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick?.(supplier)}
    >
      <SupplierHeader supplier={supplier} />
      <SupplierContact supplier={supplier} />
      <SupplierFeatures />
      <SupplierStats />
      <SupplierActions supplier={supplier} />
    </Card>
  );
}