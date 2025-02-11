
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateDropdown } from "./TemplateDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { JobTemplate } from "@/types/job-templates";
import { TemplateFilters } from "./TemplateFilters";

interface TemplateGridProps {
  templates: Record<string, JobTemplate[]>;
  columnNames: Record<string, string>;
}

export function TemplateGrid({ templates, columnNames }: TemplateGridProps) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [difficulty, setDifficulty] = useState("all");

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log('Starting template refresh...');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['job-templates'] }),
        queryClient.removeQueries({ queryKey: ['job-templates'] })
      ]);

      console.log('Queries invalidated and removed');

      await queryClient.refetchQueries({ 
        queryKey: ['job-templates'],
        exact: true,
        type: 'active'
      });

      console.log('Templates refreshed successfully');
      toast.success("Templates refreshed successfully");
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error("Failed to refresh templates");
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredTemplates = Object.entries(templates).reduce((acc, [category, items]) => {
    const filtered = items.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficulty === "all" || template.difficulty_level?.toString() === difficulty;
      return matchesSearch && matchesDifficulty;
    });

    if (filtered.length > 0) {
      acc[category] = filtered.sort((a, b) => {
        switch (sortBy) {
          case "most_used":
            return (b.usage_stats?.use_count || 0) - (a.usage_stats?.use_count || 0);
          case "success_rate":
            return (b.usage_stats?.success_rate || 0) - (a.usage_stats?.success_rate || 0);
          case "recent":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default:
            return a.name.localeCompare(b.name);
        }
      });
    }
    return acc;
  }, {} as Record<string, JobTemplate[]>);

  return (
    <Card className="h-[600px]">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle>Templates Library</CardTitle>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            title="Refresh templates"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <TemplateFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(filteredTemplates).map(([category, items]) => (
              <TemplateDropdown
                key={category}
                category={category}
                displayName={columnNames[category]}
                items={items}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
