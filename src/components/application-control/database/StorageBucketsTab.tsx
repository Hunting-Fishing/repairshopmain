
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Eye } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StorageFileViewer } from "./StorageFileViewer";

export function StorageBucketsTab() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data: buckets, isLoading, error } = useQuery({
    queryKey: ['storage-buckets'],
    queryFn: async () => {
      try {
        console.log('Fetching storage buckets...');
        const { data, error } = await supabase
          .storage
          .listBuckets();
        
        if (error) {
          console.error('Error fetching buckets:', error);
          throw error;
        }
        
        console.log('Raw buckets response:', data);
        console.log('User session:', await supabase.auth.getSession());
        return data || [];
      } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
      }
    },
  });

  const { data: files, isLoading: isLoadingFiles } = useQuery({
    queryKey: ['storage-files', selectedBucket],
    queryFn: async () => {
      if (!selectedBucket) return null;
      
      const { data, error } = await supabase
        .storage
        .from(selectedBucket)
        .list();
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBucket,
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load storage buckets. Error: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
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
                  <TableHead>Actions</TableHead>
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
                      No storage buckets found. This might be due to missing permissions or no buckets exist.
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedBucket(bucket.id)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Files
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedBucket && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Files in {selectedBucket}</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedBucket(null)}
              >
                Back to Buckets
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingFiles ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading files...</TableCell>
                    </TableRow>
                  ) : !files || files.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No files found in this bucket.
                      </TableCell>
                    </TableRow>
                  ) : (
                    files.map((file) => (
                      <TableRow key={file.name}>
                        <TableCell>{file.name}</TableCell>
                        <TableCell>{formatFileSize(file.metadata?.size)}</TableCell>
                        <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFile(file.name)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {selectedFile && selectedBucket && (
        <StorageFileViewer
          bucketName={selectedBucket}
          fileName={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "N/A";
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}
