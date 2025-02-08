
import { LineChart as RechartsLineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { BaseChartProps, tooltipStyles } from "../types";

export function LineChartComponent({ data, height = 400, showLegend }: BaseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
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
        <Line
          type="monotone"
          dataKey={data[0]?.hasOwnProperty('totalValue') ? 'totalValue' : 'value'}
          stroke="currentColor"
          strokeWidth={2}
          dot={{ strokeWidth: 2 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          className="stroke-primary"
        />
        {showLegend && <Legend />}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
