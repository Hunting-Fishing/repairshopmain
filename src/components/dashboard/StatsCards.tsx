
import { memo } from "react";
import { StatCardGrid } from "./components/stats/StatCardGrid";

interface StatsCardsProps {
  isModernTheme?: boolean;
}

export const StatsCards = memo(function StatsCards({ isModernTheme = false }: StatsCardsProps) {
  return (
    <div className="w-full animate-fade-in">
      <StatCardGrid isModernTheme={isModernTheme} />
    </div>
  );
});
