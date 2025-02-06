
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useStorageFiles } from "../hooks/useStorageFiles";
import { formatFileSize } from "../utils/formatUtils";

interface FilesListProps {
  bucketId: string;
  onSelectFile: (fileName: string) => void;
}

export function FilesList({ bucketId, onSelectFile }: FilesListProps) {
  const { data: files, isLoading } = useStorageFiles(bucketId);

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center">Loading files...</TableCell>
      </TableRow>
    );
  }

  if (!files || files.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center text-muted-foreground">
          No files found in this bucket.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {files.map((file) => (
        <TableRow key={file.name}>
          <TableCell>{file.name}</TableCell>
          <TableCell>{formatFileSize(file.metadata?.size)}</TableCell>
          <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
          <TableCell>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectFile(file.name)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
