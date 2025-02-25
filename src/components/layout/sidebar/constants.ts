
import {
  AlertCircle,
  Calendar,
  Users,
  Warehouse,
  FileText,
  Settings,
  Building2,
  Car,
  ClipboardList,
  ShoppingBag
} from "lucide-react";

interface MarketingItem {
  title: string;
  description: string;
  color: string;
  path: string;
}

export const marketingItems: MarketingItem[] = [
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
  {
    title: "Dashboard",
    icon: Building2,
    path: "/",
  },
  {
    title: "Calendar",
    icon: Calendar,
    path: "/calendar",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    title: "Work Orders",
    icon: ClipboardList,
    path: "/work-orders",
  },
  {
    title: "Vehicles",
    icon: Car,
    path: "/vehicles",
  },
  {
    title: "Staff",
    icon: Users,
    path: "/staff",
  },
  {
    title: "Shop Items",
    icon: ShoppingBag,
    path: "/shop-items",
  },
  {
    title: "Inventory",
    icon: Warehouse,
    path: "/inventory",
  },
  {
    title: "System Alerts",
    icon: AlertCircle,
    path: "/alerts",
  },
  {
    title: "Job Templates",
    icon: FileText,
    path: "/job-templates",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/application-control",
  },
];
