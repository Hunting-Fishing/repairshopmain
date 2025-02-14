
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Part } from "./types/parts";

interface PartsListProps {
  parts: Part[];
  isLoading: boolean;
}

export function PartsList({ parts, isLoading }: PartsListProps) {
  if (isLoading) {
    return <div>Loading parts...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Part Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Unit Price</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {parts?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center">No parts added yet</TableCell>
          </TableRow>
        ) : (
          parts?.map((part) => (
            <TableRow key={part.id}>
              <TableCell>{part.inventory_item.name}</TableCell>
              <TableCell>{part.inventory_item.sku}</TableCell>
              <TableCell>{part.quantity}</TableCell>
              <TableCell>${part.unit_price}</TableCell>
              <TableCell>${part.total_price}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
