
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingScreen() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900/80">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-8 w-32 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700" 
            />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
