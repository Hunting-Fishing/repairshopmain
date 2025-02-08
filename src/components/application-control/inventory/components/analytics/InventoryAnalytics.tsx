
import { BarChart3, Activity, ShoppingCart, Clock } from "lucide-react";
import { useInventoryAnalytics } from "./useInventoryAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { OverviewTab } from "./tabs/OverviewTab";
import { TrendsTab } from "./tabs/TrendsTab";
import { CategoriesTab } from "./tabs/CategoriesTab";
import { PerformanceTab } from "./tabs/PerformanceTab";

export function InventoryAnalytics() {
  const { data: analyticsData, isLoading } = useInventoryAnalytics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[160px] w-full" />
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  const monthlyTrends = [
    { name: 'Jan', value: 2400 },
    { name: 'Feb', value: 1398 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 3908 },
    { name: 'May', value: 4800 },
    { name: 'Jun', value: 3800 },
  ];

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Trends
        </TabsTrigger>
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Categories
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Performance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab analyticsData={analyticsData} monthlyTrends={monthlyTrends} />
      </TabsContent>

      <TabsContent value="trends">
        <TrendsTab categoryStats={analyticsData.categoryStats} />
      </TabsContent>

      <TabsContent value="categories">
        <CategoriesTab categoryStats={analyticsData.categoryStats} />
      </TabsContent>

      <TabsContent value="performance">
        <PerformanceTab 
          monthlyTrends={monthlyTrends} 
          categoryStats={analyticsData.categoryStats} 
        />
      </TabsContent>
    </Tabs>
  );
}
