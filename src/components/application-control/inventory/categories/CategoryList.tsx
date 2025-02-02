import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure smooth handling of resize observations
    const resizeObserver = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to avoid resize loops
      window.requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.style.height = `${entries[0]?.contentRect.height || 300}px`;
        }
      });
    });

    if (scrollRef.current) {
      resizeObserver.observe(scrollRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No categories yet. Add your first category!
      </div>
    );
  }

  return (
    <ScrollArea 
      ref={scrollRef}
      className="h-[300px] pr-4"
      style={{ minHeight: "300px" }}
    >
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