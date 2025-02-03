import { Trash2, Archive, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: 'delete' | 'archive' | 'export') => void;
}

export function BulkActions({ selectedCount, onAction }: BulkActionsProps) {
  return (
    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
      <div className="text-sm text-muted-foreground">
        {selectedCount} items selected
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('export')}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('archive')}
          className="flex items-center gap-2"
        >
          <Archive className="h-4 w-4" />
          Archive
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onAction('delete')}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}