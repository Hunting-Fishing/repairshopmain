import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { X } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      handleUnselect(item);
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <Command className={className}>
      <div className="flex flex-wrap gap-1 border rounded-md p-1">
        {selected.map((item) => (
          <Badge key={item} variant="secondary" className="rounded-sm">
            {options.find((option) => option.value === item)?.label}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUnselect(item);
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={() => handleUnselect(item)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
      <CommandGroup className="max-h-[200px] overflow-auto">
        {options.map((option) => (
          <CommandItem
            key={option.value}
            onSelect={() => handleSelect(option.value)}
          >
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}