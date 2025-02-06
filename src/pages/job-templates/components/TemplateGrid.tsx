
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateDropdown } from "./TemplateDropdown";

interface TemplateGridProps {
  templates: Record<string, string[]>;
  columnNames: Record<string, string>;
}

export function TemplateGrid({ templates, columnNames }: TemplateGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Templates Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Object.entries(templates).map(([category, items]) => (
            <TemplateDropdown
              key={category}
              category={category}
              displayName={columnNames[category] || category}
              items={items}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
