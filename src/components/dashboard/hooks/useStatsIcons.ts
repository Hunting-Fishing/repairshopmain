
import { 
  ClipboardList, 
  Users, 
  Wrench,
  Clock,
  Star,
  LucideIcon
} from "lucide-react";

export const useStatsIcons = () => {
  const statIcons: Record<string, LucideIcon> = {
    total_work_orders: ClipboardList,
    active_customers: Users,
    pending_jobs: Wrench,
    average_service_time: Clock,
    customer_satisfaction: Star,
  };

  return statIcons;
};
