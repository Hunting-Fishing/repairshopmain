
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ProductLoadingCards() {
  return (
    <>
      {Array(6).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function ProductError() {
  return (
    <Alert variant="destructive" className="col-span-full">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load products. Please try again later.
      </AlertDescription>
    </Alert>
  );
}
