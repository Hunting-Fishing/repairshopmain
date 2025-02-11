
import { Badge } from "@/components/ui/badge";
import type { SegmentAssignment } from "../types";

interface SegmentsListProps {
  segments: SegmentAssignment[] | undefined;
}

export function SegmentsList({ segments }: SegmentsListProps) {
  return (
    <div>
      <h3 className="font-medium mb-3">Segments</h3>
      <div className="flex flex-wrap gap-2">
        {segments?.map((assignment) => (
          <Badge
            key={assignment.segment.id}
            variant="secondary"
            className="px-3 py-1"
          >
            {assignment.segment.name}
          </Badge>
        ))}
        {!segments?.length && (
          <span className="text-sm text-muted-foreground">
            No segments assigned
          </span>
        )}
      </div>
    </div>
  );
}
