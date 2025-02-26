
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagsList } from "./components/TagsList";
import { SegmentsList } from "./components/SegmentsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomerSegmentsProps {
  customerId: string;
}

export function CustomerSegments({ customerId }: CustomerSegmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Segments & Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tags">
          <TabsList>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
          </TabsList>
          <TabsContent value="tags" className="mt-4">
            <TagsList customerId={customerId} />
          </TabsContent>
          <TabsContent value="segments" className="mt-4">
            <SegmentsList customerId={customerId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
