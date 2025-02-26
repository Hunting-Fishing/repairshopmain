
import { HistoryEntry } from "../hooks/useCustomerHistory";
import { format } from "date-fns";

interface CustomerHistoryItemProps {
  entry: HistoryEntry;
}

export function CustomerHistoryItem({ entry }: CustomerHistoryItemProps) {
  const getChangeDescription = () => {
    const userName = entry.profiles?.first_name 
      ? `${entry.profiles.first_name} ${entry.profiles.last_name || ''}`
      : 'A user';

    switch (entry.change_type) {
      case 'create':
        return `${userName} created this field with value: ${entry.new_value || 'empty'}`;
      case 'update':
        return `${userName} changed ${entry.field_name} from "${entry.old_value || 'empty'}" to "${entry.new_value || 'empty'}"`;
      case 'delete':
        return `${userName} removed ${entry.field_name}`;
      default:
        return `${userName} modified ${entry.field_name}`;
    }
  };

  const getChangeTypeColor = () => {
    switch (entry.change_type) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getChangeTypeColor()}`}>
            {entry.change_type}
          </span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(entry.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        <p className="text-sm">{getChangeDescription()}</p>
        {entry.notes && (
          <p className="text-sm text-muted-foreground mt-1">Note: {entry.notes}</p>
        )}
      </div>
    </div>
  );
}
