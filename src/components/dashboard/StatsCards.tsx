
import { StatCardGrid } from "./components/stats/StatCardGrid";

interface StatsCardsProps {
  isModernTheme?: boolean;
}

export function StatsCards({ isModernTheme = false }: StatsCardsProps) {
  return <StatCardGrid isModernTheme={isModernTheme} />;
}
