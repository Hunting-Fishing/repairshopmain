
import { BarChart as RechartsBarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { BaseChartProps, COLORS, tooltipStyles } from "../types";

export function StackedBarChartComponent({ data, height = 400, showLegend }: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={tooltipStyles}
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        <Bar
          dataKey="inStock"
          stackId="a"
          fill={COLORS[0]}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="lowStock"
          stackId="a"
          fill={COLORS[1]}
          radius={[4, 4, 0, 0]}
        />
        {showLegend && <Legend />}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
