
import type { CategoryStats } from "../../types";

export interface BaseChartProps {
  data: CategoryStats[] | Array<{ name: string; value: number }>;
  height?: number;
  showLegend?: boolean;
}

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const tooltipStyles = {
  backgroundColor: 'hsl(var(--background))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.5rem'
};
