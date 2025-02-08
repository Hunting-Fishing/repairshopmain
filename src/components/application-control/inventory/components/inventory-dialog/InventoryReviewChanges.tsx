
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InventoryReviewChangesProps {
  changes: Record<string, { old: any; new: any }>;
}

export function InventoryReviewChanges({ changes }: InventoryReviewChangesProps) {
  return (
    <Alert>
      <AlertTitle>Review Changes</AlertTitle>
      <AlertDescription>
        <ScrollArea className="h-[100px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {Object.entries(changes).map(([field, values]) => (
              <div key={field} className="flex items-center justify-between text-sm">
                <span className="font-medium">{field}:</span>
                <span>
                  {values.old?.toString() || "none"} → {values.new?.toString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </AlertDescription>
    </Alert>
  );
}
