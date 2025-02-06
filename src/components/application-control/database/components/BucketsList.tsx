
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStorageBuckets } from "../hooks/useStorageBuckets";

interface BucketsListProps {
  onSelectBucket: (bucketId: string) => void;
}

export function BucketsList({ onSelectBucket }: BucketsListProps) {
  const { data: buckets, isLoading, error } = useStorageBuckets();

  console.log('Buckets data:', buckets);

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center">Loading buckets...</TableCell>
      </TableRow>
    );
  }

  if (!buckets || buckets.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center text-muted-foreground">
          No storage buckets found. This might be due to missing permissions or no buckets exist.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {buckets.map((bucket) => (
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
              onClick={() => onSelectBucket(bucket.id)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Files
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
