
import { Badge } from "@/components/ui/badge";
import type { TagAssignment } from "../types";

interface TagsListProps {
  tags: TagAssignment[] | undefined;
}

export function TagsList({ tags }: TagsListProps) {
  return (
    <div>
      <h3 className="font-medium mb-3">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags?.map((assignment) => (
          <Badge
            key={assignment.tag.id}
            variant="outline"
            style={{
              backgroundColor: assignment.tag.color || undefined,
              color: '#fff'
            }}
          >
            {assignment.tag.name}
          </Badge>
        ))}
        {!tags?.length && (
          <span className="text-sm text-muted-foreground">
            No tags assigned
          </span>
        )}
      </div>
    </div>
  );
}
