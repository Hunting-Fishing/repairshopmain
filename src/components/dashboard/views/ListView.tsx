import { Card } from "@/components/ui/card";
import { StatsCards } from "../StatsCards";

export function ListView() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <StatsCards />
      </Card>
      {/* Add list view of appointments/tasks here */}
    </div>
  );
}