
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function LoadingScreen() {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in bg-gradient-to-br from-[#F8F9FF] via-white to-[#F8F9FF] dark:from-gray-900 dark:via-gray-900/50 dark:to-gray-900/80">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner 
            size="lg"
            variant="primary"
            label="Loading dashboard..."
            className="animate-fade-in"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="h-32 rounded-xl bg-gray-200/50 dark:bg-gray-700/50"
              role="progressbar"
              aria-label={`Loading card ${i + 1}`}
            />
          ))}
        </div>

        <div 
          className="h-40 rounded-xl bg-gray-200/50 dark:bg-gray-700/50 animate-pulse"
          role="progressbar"
          aria-label="Loading system status"
        />

        <div className="space-y-4">
          <div 
            className="h-10 w-96 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 animate-pulse"
            role="progressbar"
            aria-label="Loading tabs"
          />
          <div 
            className="h-[400px] rounded-xl bg-gray-200/50 dark:bg-gray-700/50 animate-pulse"
            role="progressbar"
            aria-label="Loading content"
          />
        </div>
      </div>
    </div>
  );
}
