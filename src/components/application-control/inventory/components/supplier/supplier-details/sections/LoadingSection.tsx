import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSection() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}