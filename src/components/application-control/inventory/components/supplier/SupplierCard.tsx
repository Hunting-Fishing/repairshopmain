import { Box, ExternalLink, RefreshCw, FileText, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { InventorySupplier } from "../../types";

interface SupplierCardProps {
  supplier: InventorySupplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const features = [
    { label: "INVENTORY SYNC", icon: <RefreshCw className="h-3 w-3" /> },
    { label: "PRODUCT DATA UPLOAD", icon: <FileText className="h-3 w-3" /> },
    { label: "ORDER ROUTING", icon: <Truck className="h-3 w-3" /> },
    { label: "SHIPMENT TRACKING", icon: <Box className="h-3 w-3" /> },
  ];

  return (
    <Card className="group bg-white hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
            <Box className="h-12 w-12 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold truncate">{supplier.name}</h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-0">
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

            <div className="flex flex-wrap gap-2 mb-6">
              {features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border-0 cursor-pointer"
                >
                  {feature.icon}
                  <span className="ml-1">{feature.label}</span>
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Products</div>
                <div className="text-2xl font-bold">
                  {Math.floor(Math.random() * 100000).toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Products w/ UPC</div>
                <div className="text-2xl font-bold">
                  {Math.floor(Math.random() * 50000).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Product Categories:</div>
              <div className="flex flex-wrap gap-2">
                {['Electronics', 'Home Goods', 'Accessories'].map((category, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="bg-slate-100 text-slate-600 border-0"
                  >
                    {category}
                  </Badge>
                ))}
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-0">
                  +3 More
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}