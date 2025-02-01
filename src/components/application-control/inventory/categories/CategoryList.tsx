interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="space-y-2">
      {categories?.map(category => (
        <div key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
          <span className="font-medium">{category.name}</span>
          <span className="text-sm text-muted-foreground">{category.description}</span>
        </div>
      ))}
      {(!categories || categories.length === 0) && (
        <div className="text-center text-muted-foreground py-4">
          No categories yet. Add your first category!
        </div>
      )}
    </div>
  );
}