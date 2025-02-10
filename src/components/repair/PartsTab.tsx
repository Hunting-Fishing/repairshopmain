
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Part {
  id: string;
  inventory_item_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string;
  inventory_item: {
    name: string;
    sku: string;
  };
}

interface PartsTabProps {
  repairJobId: string;
}

export function PartsTab({ repairJobId }: PartsTabProps) {
  const [isAddPartOpen, setIsAddPartOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const queryClient = useQueryClient();

  const { data: parts, isLoading } = useQuery({
    queryKey: ['repair-parts', repairJobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repair_job_parts')
        .select(`
          *,
          inventory_item:inventory_item_id (name, sku)
        `)
        .eq('repair_job_id', repairJobId);

      if (error) throw error;
      return data as Part[];
    }
  });

  const { data: inventoryItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, sku, unit_cost')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  const addPartMutation = useMutation({
    mutationFn: async (newPart: {
      repair_job_id: string;
      inventory_item_id: string;
      quantity: number;
    }) => {
      const inventoryItem = inventoryItems?.find(item => item.id === newPart.inventory_item_id);
      if (!inventoryItem) throw new Error("Part not found");

      const { error } = await supabase
        .from('repair_job_parts')
        .insert({
          repair_job_id: newPart.repair_job_id,
          inventory_item_id: newPart.inventory_item_id,
          quantity: newPart.quantity,
          unit_price: inventoryItem.unit_cost,
          total_price: inventoryItem.unit_cost * newPart.quantity,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-parts'] });
      setIsAddPartOpen(false);
      setQuantity("");
      setSelectedPart("");
      toast.success("Part added successfully");
    },
    onError: () => {
      toast.error("Failed to add part");
    }
  });

  const handleAddPart = () => {
    if (!selectedPart || !quantity) {
      toast.error("Please select a part and specify quantity");
      return;
    }

    addPartMutation.mutate({
      repair_job_id: repairJobId,
      inventory_item_id: selectedPart,
      quantity: parseInt(quantity),
    });
  };

  if (isLoading) {
    return <div>Loading parts...</div>;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Parts Used</h3>
          <Dialog open={isAddPartOpen} onOpenChange={setIsAddPartOpen}>
            <DialogTrigger asChild>
              <Button>Add Part</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Part to Repair Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="part">Select Part</Label>
                  <select
                    id="part"
                    value={selectedPart}
                    onChange={(e) => setSelectedPart(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Select a part...</option>
                    {inventoryItems?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.sku})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddPart}>Add Part</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
      </CardContent>
    </Card>
  );
}
