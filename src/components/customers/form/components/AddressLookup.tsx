
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { NominatimResult } from "../types/addressTypes";

interface AddressLookupProps {
  isSearching: boolean;
  suggestions: NominatimResult[];
  onSelect: (result: NominatimResult) => void;
}

export const AddressLookup = ({ isSearching, suggestions, onSelect }: AddressLookupProps) => {
  if (isSearching) {
    return <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground animate-spin" />;
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
      <ScrollArea className="max-h-[200px]">
        {suggestions.map((result, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm hover:bg-gray-100"
            onClick={() => onSelect(result)}
          >
            {result.display_name}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
};
