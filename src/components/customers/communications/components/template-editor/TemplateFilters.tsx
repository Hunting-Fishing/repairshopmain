
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Calendar, Archive } from "lucide-react";
import { type TemplateFilters } from "../../types/template-system";

interface TemplateFiltersProps {
  filters: Partial<TemplateFilters>;
  onFiltersChange: (filters: Partial<TemplateFilters>) => void;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export function TemplateFilters({
  filters,
  onFiltersChange,
  categories,
  tags,
}: TemplateFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="pl-8"
          />
        </div>

        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFiltersChange({ 
            ...filters, 
            sortBy: value as TemplateFilters['sortBy']
          })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="created_at">Creation Date</SelectItem>
            <SelectItem value="updated_at">Last Updated</SelectItem>
            <SelectItem value="last_used">Last Used</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ 
            ...filters, 
            status: value as TemplateFilters['status']
          })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onFiltersChange({})}
          className="shrink-0"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.categories?.map((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          if (!category) return null;
          return (
            <Badge
              key={categoryId}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  categories: filters.categories?.filter((id) => id !== categoryId),
                });
              }}
            >
              {category.name} ×
            </Badge>
          );
        })}

        {filters.tags?.map((tagId) => {
          const tag = tags.find((t) => t.id === tagId);
          if (!tag) return null;
          return (
            <Badge
              key={tagId}
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  tags: filters.tags?.filter((id) => id !== tagId),
                });
              }}
            >
              {tag.name} ×
            </Badge>
          );
        })}

        {filters.dateRange && (
          <Badge variant="outline" className="gap-2">
            <Calendar className="h-3 w-3" />
            {filters.dateRange.from.toLocaleDateString()} -{" "}
            {filters.dateRange.to.toLocaleDateString()}
          </Badge>
        )}
      </div>
    </div>
  );
}
