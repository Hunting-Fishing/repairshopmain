
import { ViewSelector } from "./ViewSelector";
import { useDashboard } from "@/contexts/DashboardContext";

export function DashboardHeader() {
  const { state, actions } = useDashboard();
  const { view: { viewMode } } = state;
  const { setViewMode } = actions;

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your repair shop's performance</p>
      </div>
      <ViewSelector viewMode={viewMode} onViewChange={setViewMode} />
    </div>
  );
}
