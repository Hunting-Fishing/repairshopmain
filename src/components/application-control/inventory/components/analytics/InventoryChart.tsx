
import type { CategoryStats } from "../../types";
import { PieChartComponent } from "./charts/PieChart";
import { LineChartComponent } from "./charts/LineChart";
import { BarChartComponent } from "./charts/BarChart";
import { StackedBarChartComponent } from "./charts/StackedBarChart";

interface InventoryChartProps {
  data: CategoryStats[] | Array<{ name: string; value: number }>;
  type?: 'bar' | 'line' | 'pie' | 'stacked';
  showLegend?: boolean;
  height?: number;
}

export function InventoryChart({ 
  data, 
  type = 'bar', 
  showLegend = false,
  height = 400 
}: InventoryChartProps) {
  switch (type) {
    case 'pie':
      return <PieChartComponent data={data} height={height} showLegend={showLegend} />;
    case 'line':
      return <LineChartComponent data={data} height={height} showLegend={showLegend} />;
    case 'stacked':
      return <StackedBarChartComponent data={data} height={height} showLegend={showLegend} />;
    default:
      return <BarChartComponent data={data} height={height} showLegend={showLegend} />;
  }
}
