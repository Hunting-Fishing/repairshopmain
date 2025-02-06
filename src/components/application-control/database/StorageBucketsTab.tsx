
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function StorageBucketsTab() {
  const { data: buckets, isLoading, error } = useQuery({
    queryKey: ['storage-buckets'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .storage
          .listBuckets();
        
        if (error) {
          console.error('Error fetching buckets:', error);
          throw error;
        }
        
        // Add console log to debug the response
        console.log('Raw buckets response:', data);
        return data || [];
      } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
      }
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load storage buckets. Error: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading buckets...</TableCell>
                </TableRow>
              ) : !buckets || buckets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No storage buckets found. Error might be related to permissions.
                  </TableCell>
                </TableRow>
              ) : (
                buckets.map((bucket) => (
                  <TableRow key={bucket.id}>
                    <TableCell className="font-medium">{bucket.name}</TableCell>
                    <TableCell>{new Date(bucket.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${bucket.public ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {bucket.public ? "Public" : "Private"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Active
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
