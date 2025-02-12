
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEmailTemplates } from "../hooks/useEmailTemplates";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmailTemplate } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: EmailTemplate) => void;
}

export function TemplateSelectionDialog({
  open,
  onOpenChange,
  onSelect,
}: TemplateSelectionDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { templates, categories, isLoading } = useEmailTemplates();

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.subject.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = !selectedCategory || template.category_id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Select Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search templates..." 
              value={search}
              onValueChange={setSearch}
            />
            <ScrollArea className="h-[300px]">
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Loading templates...
                  </p>
                </div>
              ) : (
                <CommandGroup>
                  {filteredTemplates.length === 0 ? (
                    <CommandEmpty>No templates found.</CommandEmpty>
                  ) : (
                    filteredTemplates.map((template) => (
                      <CommandItem
                        key={template.id}
                        onSelect={() => {
                          onSelect(template);
                          onOpenChange(false);
                        }}
                        className="flex items-center gap-2 p-2"
                      >
                        <Check className={cn(
                          "h-4 w-4 opacity-0",
                          template.is_default && "opacity-100"
                        )} />
                        <div className="flex flex-col">
                          <span className="font-medium">{template.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {template.subject}
                          </span>
                        </div>
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              )}
            </ScrollArea>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
}
