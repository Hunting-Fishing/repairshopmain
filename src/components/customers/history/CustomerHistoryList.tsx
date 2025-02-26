
import { useCustomerHistory } from "../hooks/useCustomerHistory";
import { CustomerHistoryItem } from "./CustomerHistoryItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, History } from "lucide-react";

interface CustomerHistoryListProps {
  customerId: string;
}

export function CustomerHistoryList({ customerId }: CustomerHistoryListProps) {
  const { historyEntries, isLoading } = useCustomerHistory(customerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!historyEntries?.length) {
    return (
      <div className="text-center py-8">
        <History className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No History Available</h3>
        <p className="text-sm text-muted-foreground">
          Changes to this customer will be tracked and shown here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {historyEntries.map((entry) => (
          <CustomerHistoryItem key={entry.id} entry={entry} />
        ))}
      </div>
    </ScrollArea>
  );
}
