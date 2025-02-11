
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { JobTemplate } from "@/types/job-templates";
import { useState } from "react";

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
          className="w-[300px] max-h-[300px] overflow-y-auto"
        >
          {items.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              No templates available
            </div>
          ) : (
            items.map((template) => (
              <DropdownMenuItem 
                key={template.id}
                className="flex flex-col items-start gap-1 p-2"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{template.name}</span>
                  {template.status && (
                    <Badge variant="secondary" className={getStatusColor(template.status)}>
                      {template.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                {template.job_number && (
                  <span className="text-xs text-muted-foreground">
                    Job #{template.job_number}
                  </span>
                )}
                {template.description && (
                  <span className="text-xs text-muted-foreground">
                    {template.description}
                  </span>
                )}
                {template.sub_tasks && template.sub_tasks.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {template.sub_tasks.length} sub-tasks
                  </span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
