
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Specialty {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

interface SpecialtyListProps {
  specialties: Specialty[];
}

export function SpecialtyList({ specialties }: SpecialtyListProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      case 'intermediate':
        return 'bg-green-100 text-green-800';
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2 p-2">
        {specialties.map((specialty) => (
          <div
            key={specialty.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
          >
            <span className="font-medium">{specialty.name}</span>
            <Badge className={getLevelColor(specialty.level)}>
              {specialty.level}
            </Badge>
          </div>
        ))}
        {specialties.length === 0 && (
          <div className="text-center text-muted-foreground py-4">
            No specialties added yet
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
