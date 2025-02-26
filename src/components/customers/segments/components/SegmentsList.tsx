
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { CustomerSegment } from "../types";

interface SegmentsListProps {
  customerId: string;
}

export function SegmentsList({ customerId }: SegmentsListProps) {
  const { data: segments } = useQuery({
    queryKey: ["customer-segments", customerId],
    queryFn: async () => {
      const { data: assignments, error } = await supabase
        .from("customer_segment_assignments")
        .select(`
          segment:customer_segments(
            id,
            name,
            description,
            criteria
          )
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      return assignments.map(a => a.segment as CustomerSegment);
    }
  });

  if (!segments?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            Customer is not assigned to any segments
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {segments.map((segment) => (
        <Card key={segment.id}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              {segment.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {segment.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(segment.criteria || {}).map(([key, value]) => (
                <Badge key={key} variant="outline">
                  {key}: {String(value)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
