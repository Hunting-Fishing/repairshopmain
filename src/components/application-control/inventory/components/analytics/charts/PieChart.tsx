
import { PieChart as RechartsBarPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { BaseChartProps, COLORS, tooltipStyles } from "../types";

export function PieChartComponent({ data, height = 400, showLegend }: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percent }) => `${name}: $${value} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={height / 3}
          fill="#8884d8"
          dataKey="totalValue"
          animationBegin={0}
          animationDuration={1500}
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              className="hover:opacity-80 transition-opacity duration-200"
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `$${value.toFixed(2)}`}
          contentStyle={tooltipStyles}
        />
        {showLegend && <Legend />}
      </RechartsBarPie>
    </ResponsiveContainer>
  );
}
