
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export function StorageBucketsTab() {
  const { data: buckets, isLoading } = useQuery({
    queryKey: ['storage-buckets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .listBuckets();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Buckets</CardTitle>
        <CardDescription>View and manage storage buckets</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Public</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">Loading buckets...</TableCell>
                </TableRow>
              ) : buckets?.map((bucket) => (
                <TableRow key={bucket.id}>
                  <TableCell>{bucket.name}</TableCell>
                  <TableCell>{new Date(bucket.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{bucket.public ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
