
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StorageFileViewer } from "./StorageFileViewer";
import { BucketsList } from "./components/BucketsList";
import { FilesList } from "./components/FilesList";
import { useStorageBuckets } from "./hooks/useStorageBuckets";

export function StorageBucketsTab() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { error } = useStorageBuckets();

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
                <BucketsList onSelectBucket={setSelectedBucket} />
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
                  <FilesList 
                    bucketId={selectedBucket}
                    onSelectFile={setSelectedFile}
                  />
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
