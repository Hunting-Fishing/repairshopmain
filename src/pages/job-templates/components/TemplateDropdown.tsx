
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { JobTemplate } from "@/hooks/use-job-templates";
import { useState } from "react";

interface TemplateDropdownProps {
  category: string;
  displayName: string;
  items: JobTemplate[];
}

export function TemplateDropdown({ category, displayName, items }: TemplateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          className="w-[250px] max-h-[300px] overflow-y-auto"
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
                <span className="font-medium">{template.name}</span>
                {template.description && (
                  <span className="text-xs text-muted-foreground">{template.description}</span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
