
import { Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type HistoryFiltersProps } from "../types";

export function HistoryFilters({
  filterField,
  filterType,
  uniqueFields,
  uniqueTypes,
  onFilterFieldChange,
  onFilterTypeChange,
  onExport,
}: HistoryFiltersProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        <History className="h-4 w-4" />
        <span>Change History</span>
      </div>
      <div className="flex items-center gap-4">
        <Select value={filterField} onValueChange={onFilterFieldChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            {uniqueFields.map(field => (
              <SelectItem key={field} value={field}>
                {field.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
