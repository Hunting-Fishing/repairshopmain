import { useQuery } from "@tanstack/react-query";
import { Box } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers: InventorySupplier[];
}

export function InventorySuppliers({ suppliers }: InventorySuppliersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          Suppliers
        </CardTitle>
        <CardDescription>Supplier management and tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {suppliers?.map(supplier => (
            <div key={supplier.id} className="flex items-center justify-between">
              <span>{supplier.name}</span>
              <span className="text-sm text-muted-foreground">{supplier.contact_person}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}