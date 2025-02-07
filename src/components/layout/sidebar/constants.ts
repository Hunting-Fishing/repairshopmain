
import { Car, ClipboardList, Home, Users, Settings2, UserCog, Package, ShoppingBag } from "lucide-react";

export const marketingItems = [
  {
    title: "Parts Revenue",
    description: "Earn commissions on Amazon parts sales",
    color: "bg-orange-500",
    path: "/application-control/integrations"
  },
  {
    title: "Auto-Link Parts",
    description: "Automatic part linking to Amazon",
    color: "bg-orange-600",
    path: "/application-control/integrations"
  },
  {
    title: "Prime Benefits",
    description: "Fast shipping for your customers",
    color: "bg-orange-700",
    path: "/application-control/integrations"
  }
];

export const getBaseMenuItems = () => [
  { title: "Dashboard", icon: Home, path: "/" },
  { title: "Customers", icon: Users, path: "/customers" },
  { title: "Work Orders", icon: ClipboardList, path: "/work-orders" },
  { title: "Vehicles", icon: Car, path: "/vehicles" },
  { title: "Inventory", icon: Package, path: "/inventory" },
  { title: "Shop Items", icon: ShoppingBag, path: "/shop-items" },
  { title: "Staff", icon: UserCog, path: "/staff" },
];
