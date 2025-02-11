
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";

interface CustomerSegmentsProps {
  customerId: string;
}

export function CustomerSegments({ customerId }: CustomerSegmentsProps) {
  const { data: segments } = useQuery({
    queryKey: ["customer-segments", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_segment_assignments")
        .select(`
          segment:customer_segments (
            id,
            name,
            description,
            criteria
          )
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      return data;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["customer-tags", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_tag_assignments")
        .select(`
          tag:customer_tags (
            id,
            name,
            color,
            description
          )
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Segments & Tags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

          <div>
            <h3 className="font-medium mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags?.map((assignment) => (
                <Badge
                  key={assignment.tag.id}
                  variant="outline"
                  style={{
                    backgroundColor: assignment.tag.color,
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
        </div>
      </CardContent>
    </Card>
  );
}
