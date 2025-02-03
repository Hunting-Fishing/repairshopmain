import { Box, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddSupplierDialog } from "./components/supplier/AddSupplierDialog";
import type { InventorySupplier } from "./types";

interface InventorySuppliersProps {
  suppliers: InventorySupplier[];
}

export function InventorySuppliers({ suppliers }: InventorySuppliersProps) {
  console.log("InventorySuppliers - Rendering with suppliers:", suppliers);

  if (!Array.isArray(suppliers)) {
    console.error("InventorySuppliers - suppliers is not an array:", suppliers);
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Error loading suppliers data. Please try refreshing the page.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-bold tracking-tight">Suppliers</h2>
          </div>
          <p className="text-muted-foreground">
            Manage your inventory suppliers and their contact information
          </p>
        </div>
        <AddSupplierDialog />
      </div>

      {suppliers && suppliers.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{supplier.name}</CardTitle>
                  </div>
                  <Badge 
                    variant={supplier.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {supplier.status}
                  </Badge>
                </div>
                {supplier.contact_person && (
                  <CardDescription>Contact: {supplier.contact_person}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${supplier.email}`} className="hover:underline">
                      {supplier.email}
                    </a>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${supplier.phone}`} className="hover:underline">
                      {supplier.phone}
                    </a>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{supplier.address}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {suppliers.length === 0 ? (
              "No suppliers found. Add your first supplier to get started."
            ) : (
              "Loading suppliers..."
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}