
/**
 * File: src/pages/job-templates/components/TemplateGrid.tsx
 * Displays a grid of job templates organized by category
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateDropdown } from "./TemplateDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

interface TemplateGridProps {
  templates: Record<string, string[]>;
  columnNames: Record<string, string>;
}

export function TemplateGrid({ templates, columnNames }: TemplateGridProps) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      console.log('Starting template refresh...');

      // First invalidate and remove existing data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['job-templates'] }),
        queryClient.removeQueries({ queryKey: ['job-templates'] })
      ]);

      console.log('Queries invalidated and removed');

      // Then force a fresh refetch
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

  return (
    <Card className="h-[600px]">
      <CardHeader className="flex flex-row items-center justify-between">
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
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(templates).map(([category, items]) => (
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
