
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Clock, Star, TrendingUp, Users } from "lucide-react";
import { JobTemplate } from "@/types/job-templates";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TemplateDropdownProps {
  category: string;
  displayName: string;
  items: JobTemplate[];
}

export function TemplateDropdown({ category, displayName, items }: TemplateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="flex flex-col space-y-2 group hover:bg-accent/5 p-2 rounded-lg transition-colors">
      <h3 className="font-semibold text-sm">{displayName}</h3>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between group-hover:border-accent-foreground/20 transition-colors"
          >
            Select Template 
            <ChevronDown className={`h-4 w-4 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-[350px] max-h-[400px] overflow-y-auto"
        >
          {items.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              No templates available
            </div>
          ) : (
            items.map((template) => (
              <DropdownMenuItem 
                key={template.id}
                className="flex flex-col items-start gap-2 p-3"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{template.name}</span>
                  {template.status && (
                    <Badge variant="secondary" className={getStatusColor(template.status)}>
                      {template.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                
                {template.description && (
                  <span className="text-xs text-muted-foreground">
                    {template.description}
                  </span>
                )}

                <div className="flex items-center gap-3 w-full text-xs text-muted-foreground">
                  {template.estimated_duration_range && (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(template.estimated_duration_range.min)} - {formatDuration(template.estimated_duration_range.max)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Estimated duration range</TooltipContent>
                    </Tooltip>
                  )}
                  
                  {template.usage_stats?.success_rate !== undefined && (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {Math.round(template.usage_stats.success_rate * 100)}% success
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Success rate</TooltipContent>
                    </Tooltip>
                  )}

                  {template.usage_stats?.use_count !== undefined && (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {template.usage_stats.use_count} uses
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Number of times used</TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {template.difficulty_level && (
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Difficulty</span>
                      <span>{template.difficulty_level}/5</span>
                    </div>
                    <Progress value={template.difficulty_level * 20} className="h-1" />
                  </div>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
