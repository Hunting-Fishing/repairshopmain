
import { BarChart2, Calendar, FileText, ShoppingCart, Users, Settings2, MessageSquare, Home, Wrench } from "lucide-react";

export function getBaseMenuItems() {
  return [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "Calendar", icon: Calendar, path: "/calendar" },
    { title: "Customers", icon: Users, path: "/customers" },
    { title: "Shop", icon: ShoppingCart, path: "/shop" },
    { title: "Job Templates", icon: FileText, path: "/job-templates" },
    { title: "Staff", icon: Users, path: "/staff" },
    { title: "Reports", icon: BarChart2, path: "/reports" }
  ];
}

export const marketingItems = [
  {
    title: "New Features",
    description: "Discover the latest updates to our platform",
    path: "/updates",
    color: "bg-blue-600"
  },
  {
    title: "Best Practices",
    description: "Learn how to optimize your workflow",
    path: "/best-practices",
    color: "bg-green-600"
  },
  {
    title: "Premium Support",
    description: "Get dedicated help for your business",
    path: "/premium-support",
    color: "bg-purple-600"
  }
];
