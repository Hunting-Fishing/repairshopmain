
import { Bar, BarChart, Line, LineChart, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { CategoryStats } from "../../types";

interface InventoryChartProps {
  data: CategoryStats[] | Array<{ name: string; value: number }>;
  type?: 'bar' | 'line' | 'pie' | 'stacked';
  showLegend?: boolean;
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function InventoryChart({ 
  data, 
  type = 'bar', 
  showLegend = false,
  height = 400 
}: InventoryChartProps) {
  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
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
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem'
            }}
          />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
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
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'stacked') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
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
            contentStyle={{ 
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem'
            }}
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
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
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
      </BarChart>
    </ResponsiveContainer>
  );
}
