import { Box, ExternalLink, Package, Truck, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const features = [
    { label: "INVENTORY SYNC", color: "bg-blue-100 text-blue-700" },
    { label: "PRODUCT DATA UPLOAD", color: "bg-green-100 text-green-700" },
    { label: "ORDER ROUTING", color: "bg-purple-100 text-purple-700" },
    { label: "SHIPMENT TRACKING", color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
            <Box className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold truncate">{supplier.name}</h3>
                  <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                    {supplier.status}
                  </Badge>
                </div>
                {supplier.contact_person && (
                  <p className="text-sm text-muted-foreground mt-1">{supplier.contact_person}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className={`${feature.color} border-0`}
                >
                  {feature.label}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Products</div>
                <div className="text-2xl font-bold">
                  {Math.floor(Math.random() * 100000).toLocaleString()}
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Products w/ UPC</div>
                <div className="text-2xl font-bold">
                  {Math.floor(Math.random() * 50000).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Products
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Truck className="h-4 w-4 mr-2" />
                Orders
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}