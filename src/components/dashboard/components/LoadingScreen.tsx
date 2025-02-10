
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingScreen() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in bg-gradient-to-br from-[#F8F9FF] via-white to-[#F8F9FF] dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900/80">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-32 rounded-xl bg-gray-200/50 dark:bg-gray-700/50" 
            />
          ))}
        </div>

        {/* System Status Card */}
        <Skeleton className="h-40 rounded-xl bg-gray-200/50 dark:bg-gray-700/50" />

        {/* Calendar Handler */}
        <Skeleton className="h-64 rounded-xl bg-gray-200/50 dark:bg-gray-700/50" />

        {/* Tabs Content */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-96 rounded-lg bg-gray-200/50 dark:bg-gray-700/50" />
          <Skeleton className="h-[400px] rounded-xl bg-gray-200/50 dark:bg-gray-700/50" />
        </div>
      </div>
    </div>
  );
}
