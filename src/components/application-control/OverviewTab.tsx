
import { Building2, Users, Car, Wrench, Calendar, UserSquare2, Package, Truck, Database, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { SystemStatus } from "./SystemStatus";
import { DashboardStatsConfig } from "./dashboard/DashboardStatsConfig";

export function OverviewTab() {
  const navigate = useNavigate();

  const controlPanels = [
    {
      title: "Shop Management",
      description: "Manage shop details, business hours, and settings",
      icon: Building2,
      action: () => navigate("/application-control/shops"),
    },
    {
      title: "Staff Management",
      description: "Manage employees, roles, and permissions",
      icon: Users,
      action: () => navigate("/staff"),
    },
    {
      title: "Vehicle Management",
      description: "Configure vehicle types and service options",
      icon: Car,
      action: () => navigate("/vehicles"),
    },
    {
      title: "Service Management",
      description: "Define service types, pricing, and durations",
      icon: Wrench,
      action: () => navigate("/services"),
    },
    {
      title: "Calendar Settings",
      description: "Configure business hours and scheduling rules",
      icon: Calendar,
      action: () => navigate("/calendar-settings"),
    },
    {
      title: "Customer Management",
      description: "Configure customer settings and view analytics",
      icon: UserSquare2,
      action: () => navigate("/customer-management"),
    },
    {
      title: "Inventory Management",
      description: "Manage inventory items and categories",
      icon: Package,
      action: () => navigate("/inventory"),
    },
    {
      title: "Job Templates",
      description: "Manage job templates and procedures",
      icon: ClipboardList,
      action: () => navigate("/application-control/job-templates"),
    },
    {
      title: "Supplier Management",
      description: "Manage suppliers, documents, and transactions",
      icon: Truck,
      action: () => navigate("/inventory/suppliers"),
    },
    {
      title: "Database Management",
      description: "View and manage database storage and tables",
      icon: Database,
      action: () => document.querySelector('[value="database"]')?.dispatchEvent(new Event('click')),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {controlPanels.map((panel) => (
          <ControlPanel key={panel.title} {...panel} />
        ))}
      </div>
      
      <DashboardStatsConfig />
      <SystemStatus />
    </div>
  );
}
