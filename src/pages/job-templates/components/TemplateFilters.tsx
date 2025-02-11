
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Clock, Star, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
}

export function TemplateFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  difficulty,
  onDifficultyChange,
}: TemplateFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="most_used">Most Used</SelectItem>
            <SelectItem value="success_rate">Success Rate</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1">Beginner</SelectItem>
            <SelectItem value="2">Intermediate</SelectItem>
            <SelectItem value="3">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" /> Duration
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Star className="h-3 w-3" /> Rating
        </Badge>
        <Badge variant="outline" className="gap-1">
          <TrendingUp className="h-3 w-3" /> Success Rate
        </Badge>
      </div>
    </div>
  );
}
