import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CategoryStats } from "../../types";

interface InventoryChartProps {
  data: CategoryStats[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function InventoryChart({ data }: InventoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
        <CardDescription>Distribution of items and value across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-xs"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="#82ca9d"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#8884d8"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="totalItems" 
                fill="#8884d8" 
                name="Total Items"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right" 
                dataKey="lowStock" 
                fill="#82ca9d" 
                name="Low Stock"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}