import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (!categories?.length) {
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
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
              <div className="space-y-1">
                <h4 className="text-sm font-medium leading-none">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
              </div>
            </div>
            <Separator className="mt-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}