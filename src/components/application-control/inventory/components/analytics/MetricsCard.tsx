import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    timeFrame?: string;
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
          <div className={cn("text-2xl font-bold", className)}>
            {value}
          </div>
          {trend && (
            <div className="flex flex-col items-end gap-1">
              <div 
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                  trend.isPositive 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/30"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {trend.value}%
              </div>
              {trend.timeFrame && (
                <span className="text-xs text-muted-foreground">
                  vs {trend.timeFrame}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}