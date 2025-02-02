import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoryStats } from "../../types";

interface InventoryChartProps {
  data: CategoryStats[];
}

export function InventoryChart({ data }: InventoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory by Category</CardTitle>
        <CardDescription>Distribution of items and value across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
              <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="totalItems" fill="#8884d8" name="Total Items" />
              <Bar yAxisId="right" dataKey="lowStock" fill="#82ca9d" name="Low Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}