
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTemplateComponents } from "../../hooks/useTemplateComponents";
import { Plus } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ComponentEditor } from "./ComponentEditor";

interface ComponentsLibraryProps {
  onInsert: (content: string) => void;
}

export function ComponentsLibrary({ onInsert }: ComponentsLibraryProps) {
  const { components, isLoading } = useTemplateComponents();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const categories = Array.from(
    new Set(components.map((component) => component.category))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Components Library</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Component
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Component</DialogTitle>
            </DialogHeader>
            <ComponentEditor />
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                {category || "Uncategorized"}
              </h4>
              <div className="grid gap-2">
                {components
                  .filter((c) => c.category === category)
                  .map((component) => (
                    <Button
                      key={component.id}
                      variant="outline"
                      className="justify-start font-normal"
                      onClick={() => onInsert(component.content)}
                    >
                      {component.name}
                    </Button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
