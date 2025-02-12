
import { MessageSquare } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">No communications yet</h3>
      <p className="text-muted-foreground">Start a conversation by sending a message.</p>
    </div>
  );
}
