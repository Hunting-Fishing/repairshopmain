
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { SegmentsList } from "./components/SegmentsList";
import { TagsList } from "./components/TagsList";
import { useCustomerSegments } from "./hooks/useCustomerSegments";
import { useCustomerTags } from "./hooks/useCustomerTags";

interface CustomerSegmentsProps {
  customerId: string;
}

export function CustomerSegments({ customerId }: CustomerSegmentsProps) {
  const { data: segments } = useCustomerSegments(customerId);
  const { data: tags } = useCustomerTags(customerId);

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
          <SegmentsList segments={segments} />
          <TagsList tags={tags} />
        </div>
      </CardContent>
    </Card>
  );
}
