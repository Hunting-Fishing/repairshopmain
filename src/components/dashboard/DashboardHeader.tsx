import { ViewSelector } from "./ViewSelector";

interface DashboardHeaderProps {
  viewMode: "calendar" | "grid" | "list";
  onViewChange: (value: "calendar" | "grid" | "list") => void;
}

export function DashboardHeader({ viewMode, onViewChange }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your repair shop's performance</p>
      </div>
      <ViewSelector viewMode={viewMode} onViewChange={onViewChange} />
    </div>
  );
}