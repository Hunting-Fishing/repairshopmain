
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, FileIcon, Folder } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { StorageFileViewer } from "./StorageFileViewer";

export function StorageBuckets() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { data: buckets, isLoading: isLoadingBuckets } = useQuery({
    queryKey: ['storage-buckets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .storage
        .listBuckets();
      
      if (error) throw error;
      return data;
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

  return (
    <div className="space-y-4">
      {/* Buckets List */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Buckets</CardTitle>
          <CardDescription>View and manage storage buckets and their contents</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
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
                {isLoadingBuckets ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading buckets...</TableCell>
                  </TableRow>
                ) : buckets?.map((bucket) => (
                  <TableRow key={bucket.id}>
                    <TableCell>{bucket.name}</TableCell>
                    <TableCell>{new Date(bucket.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{bucket.public ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedBucket(bucket.name)}
                      >
                        <Folder className="h-4 w-4 mr-2" />
                        View Files
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Files List */}
      {selectedBucket && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Files in {selectedBucket}</CardTitle>
              <Button 
                variant="ghost" 
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
                  ) : files?.map((file) => (
                    <TableRow key={file.name}>
                      <TableCell className="flex items-center gap-2">
                        <FileIcon className="h-4 w-4" />
                        {file.name}
                      </TableCell>
                      <TableCell>{formatFileSize(file.metadata?.size)}</TableCell>
                      <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(file.name)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* File Viewer */}
      {selectedFile && (
        <StorageFileViewer
          bucketName={selectedBucket!}
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
