import { Building2, Users, Car, Wrench, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ControlPanel } from "./ControlPanel";
import { SystemStatus } from "./SystemStatus";

export function OverviewTab() {
  const navigate = useNavigate();

  const controlPanels = [
    {
      title: "Shop Management",
      description: "Manage shop details, business hours, and settings",
      icon: Building2,
      action: () => navigate("/shops"),
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
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {controlPanels.map((panel) => (
        <ControlPanel key={panel.title} {...panel} />
      ))}
      <SystemStatus />
    </div>
  );
}