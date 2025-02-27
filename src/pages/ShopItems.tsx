
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { ShopItemsList } from "@/components/shop/ShopItemsList";

export default function ShopItems() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShoppingBag className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Shop Items</h1>
                <p className="text-muted-foreground">
                  Manage shop products and services
                </p>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <ShopItemsList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
