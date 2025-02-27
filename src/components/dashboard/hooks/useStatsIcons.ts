
import { 
  ClipboardList, 
  Users, 
  Wrench,
  Clock,
  Star,
  LucideIcon,
  BarChart // Added as default icon
} from "lucide-react";

export const useStatsIcons = () => {
  const statIcons: Record<string, LucideIcon> = {
    total_work_orders: ClipboardList,
    active_customers: Users,
    pending_jobs: Wrench,
    average_service_time: Clock,
    customer_satisfaction: Star,
    default: BarChart // Adding a default icon
  };

  return statIcons;
};
