
import { BarChart2, Calendar, FileText, ShoppingCart, Users, Settings2, MessageSquare, Home } from "lucide-react";

export function getBaseMenuItems() {
  return [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Calendar", icon: Calendar, path: "/calendar" },
    { title: "Customers", icon: Users, path: "/customers" },
    { title: "Shop", icon: ShoppingCart, path: "/shop" },
    { title: "Job Templates", icon: FileText, path: "/job-templates" },
    { title: "Reports", icon: BarChart2, path: "/reports" }
  ];
}
