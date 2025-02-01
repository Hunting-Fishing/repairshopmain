import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryList({ 
  categories, 
  selectedCategoryId,
  onSelectCategory 
}: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No categories yet. Add your first category!
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between hover:bg-muted transition-colors",
                selectedCategoryId === category.id && "bg-muted"
              )}
              onClick={() => onSelectCategory?.(category.id)}
            >
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-medium leading-none">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                )}
              </div>
              {selectedCategoryId === category.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </Button>
            <Separator className="mt-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}