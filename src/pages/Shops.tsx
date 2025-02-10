
import { ShopList } from "@/components/shops/ShopList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Shops() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shop Management</CardTitle>
        </CardHeader>
        <CardContent>
          <ShopList />
        </CardContent>
      </Card>
    </div>
  );
}
