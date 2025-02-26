
import { CustomerRelationship } from "../types/customerTypes";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface RelationshipHierarchyViewProps {
  relationships: CustomerRelationship[];
  onDelete: (id: string) => void;
}

export function RelationshipHierarchyView({ relationships, onDelete }: RelationshipHierarchyViewProps) {
  const groupedRelationships = relationships.reduce((acc, rel) => {
    const type = rel.relationship_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(rel);
    return acc;
  }, {} as Record<string, CustomerRelationship[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedRelationships).map(([type, rels]) => (
        <div key={type} className="space-y-2">
          <h4 className="text-sm font-semibold capitalize">{type} Relationships</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {rels.map((rel) => (
              <div
                key={rel.id}
                className="relative flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {rel.related_first_name} {rel.related_last_name}
                  </p>
                  {rel.is_primary && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      Primary
                    </span>
                  )}
                  {rel.notes && (
                    <p className="text-sm text-muted-foreground">{rel.notes}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDelete(rel.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
