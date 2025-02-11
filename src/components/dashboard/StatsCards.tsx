
import { StatCardGrid } from "./components/stats/StatCardGrid";

interface StatsCardsProps {
  isModernTheme?: boolean;
}

export function StatsCards({ isModernTheme = false }: StatsCardsProps) {
  return (
    <div className="w-full animate-fade-in">
      <StatCardGrid isModernTheme={isModernTheme} />
    </div>
  );
}
