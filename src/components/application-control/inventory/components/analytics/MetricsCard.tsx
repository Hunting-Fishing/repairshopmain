import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricsCard({ title, value, icon: Icon, className, trend }: MetricsCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", className || "text-muted-foreground")} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={cn("text-2xl font-bold", className || '')}>
            {value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-sm",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="mr-1 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}