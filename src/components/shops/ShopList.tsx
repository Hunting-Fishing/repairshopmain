import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

export function ShopList() {
  const { toast } = useToast();

  const { data: shops, isLoading } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");

      if (error) {
        toast({
          title: "Error fetching shops",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading shops...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shop Name</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops?.map((shop) => (
            <TableRow key={shop.id}>
              <TableCell className="font-medium">{shop.name}</TableCell>
              <TableCell>{shop.business_type}</TableCell>
              <TableCell>{shop.phone_number || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}