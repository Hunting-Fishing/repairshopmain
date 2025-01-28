import { ShopList } from "@/components/shops/ShopList";

export default function IndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auto Repair Shops</h1>
        <p className="text-muted-foreground">
          View and manage repair shops in the network
        </p>
      </div>
      <ShopList />
    </div>
  );
}