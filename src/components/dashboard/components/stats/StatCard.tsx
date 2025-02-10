
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatStatValue } from "../../utils/statsFormatters";

interface StatCardProps {
  title: string;
  value: number;
  type: string;
  trend: number;
  trendDirection: boolean;
  icon: LucideIcon;
  isModernTheme?: boolean;
  index: number;
}

export function StatCard({ 
  title, 
  value, 
  type, 
  trend, 
  trendDirection, 
  icon: Icon,
  isModernTheme = false,
  index
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-105 group",
        isModernTheme 
          ? "bg-gradient-to-br from-white via-white to-[#F8F9FF] dark:from-gray-800 dark:via-gray-800/90 dark:to-gray-800/80 shadow-lg hover:shadow-xl border border-[#E2E8F0]/50 dark:border-blue-900/50"
          : ""
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className={cn(
            "text-sm font-medium",
            isModernTheme 
              ? "text-gray-600 dark:text-gray-300" 
              : ""
          )}>
            {title}
          </CardTitle>
          {Icon && (
            <Icon className={cn(
              "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
              isModernTheme 
                ? "text-blue-500 dark:text-blue-400" 
                : ""
            )} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold mb-1",
          isModernTheme 
            ? "bg-gradient-to-br from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
            : ""
        )}>
          {formatStatValue(type, value)}
        </div>
        <div className="flex items-center text-xs">
          {trendDirection ? (
            <TrendingUp className={cn(
              "h-3 w-3 mr-1",
              isModernTheme 
                ? "text-emerald-500 dark:text-emerald-400"
                : ""
            )} />
          ) : (
            <TrendingDown className={cn(
              "h-3 w-3 mr-1",
              isModernTheme 
                ? "text-red-500 dark:text-red-400"
                : ""
            )} />
          )}
          <span className={cn(
            trendDirection 
              ? "text-emerald-500 dark:text-emerald-400" 
              : "text-red-500 dark:text-red-400"
          )}>
            {trendDirection ? '+' : ''}{trend}%
          </span>
          <span className={cn(
            "ml-1",
            isModernTheme 
              ? "text-gray-500 dark:text-gray-400" 
              : ""
          )}>
            from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
