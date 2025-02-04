import { Card } from "@/components/ui/card";
import { StatsCards } from "../StatsCards";

export function GridView() {
  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <StatsCards />
      </Card>
      {/* Add grid view of appointments/tasks here */}
    </div>
  );
}