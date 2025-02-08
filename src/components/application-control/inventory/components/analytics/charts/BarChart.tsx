
import { BarChart as RechartsBarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { BaseChartProps, tooltipStyles } from "../types";

export function BarChartComponent({ data, height = 400, showLegend }: BaseChartProps) {
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
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            
            const data = payload[0]?.payload;
            if (!data) return null;

            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      {data.name}
                    </span>
                    <span className="font-bold">
                      ${(data.totalValue || data.value).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Bar
          dataKey={data[0]?.hasOwnProperty('totalValue') ? 'totalValue' : 'value'}
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        {showLegend && <Legend />}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
