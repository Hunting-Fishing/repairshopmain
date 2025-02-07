
// File: src/pages/job-templates/components/TemplateGrid.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateDropdown } from "./TemplateDropdown";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TemplateGridProps {
  templates: Record<string, string[]>;
  columnNames: Record<string, string>;
}

export function TemplateGrid({ templates, columnNames }: TemplateGridProps) {
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle>Templates Library</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(templates).map(([category, items]) => (
              <TemplateDropdown
                key={category}
                category={category}
                displayName={columnNames[category]}
                items={items}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

