
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TemplateDropdownProps {
  category: string;
  displayName: string;
  items: string[];
}

export function TemplateDropdown({ category, displayName, items }: TemplateDropdownProps) {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="font-semibold text-sm">{displayName}</h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select Template <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[250px] max-h-[300px] overflow-y-auto">
          {items.map((item, index) => (
            <DropdownMenuItem key={`${category}-${index}`}>
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
