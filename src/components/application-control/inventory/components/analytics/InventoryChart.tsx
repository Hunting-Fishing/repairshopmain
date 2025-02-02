import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CategoryStats } from "../../types";

interface InventoryChartProps {
  data: CategoryStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-4 shadow-md">
        <p className="font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex justify-center gap-6 pt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function InventoryChart({ data }: InventoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
        <CardDescription>Distribution of items and value across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted/30"
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="hsl(var(--primary))"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${value}`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="hsl(var(--destructive))"
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
              />
              <Legend content={<CustomLegend />} />
              <Bar 
                yAxisId="left" 
                dataKey="totalItems" 
                fill="hsl(var(--primary))" 
                name="Total Items"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
              <Bar 
                yAxisId="right" 
                dataKey="lowStock" 
                fill="hsl(var(--destructive))" 
                name="Low Stock"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}