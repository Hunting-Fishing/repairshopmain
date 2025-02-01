import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { List, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOrganizationData } from "@/hooks/staff/useOrganizationData";

export function InventoryCategories() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const { userProfile } = useOrganizationData();

  const { data: categories, refetch } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: async () => {
      if (!userProfile?.organization_id) return [];
      
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .eq('organization_id', userProfile.organization_id)
        .throwOnError();
      return data || [];
    },
    enabled: !!userProfile?.organization_id
  });

  const handleAddCategory = async () => {
    if (!userProfile?.organization_id) {
      toast({
        title: "Error",
        description: "Organization ID not found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('inventory_categories')
        .insert([{ 
          name, 
          description,
          organization_id: userProfile.organization_id 
        }]);

      if (error) throw error;

      toast({
        title: "Category added",
        description: "The category has been successfully added.",
      });

      setIsOpen(false);
      setName("");
      setDescription("");
      refetch();
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="h-5 w-5" />
            <CardTitle>Categories</CardTitle>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Category description"
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Inventory category management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {categories?.map(category => (
            <div key={category.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
              <span className="font-medium">{category.name}</span>
              <span className="text-sm text-muted-foreground">{category.description}</span>
            </div>
          ))}
          {(!categories || categories.length === 0) && (
            <div className="text-center text-muted-foreground py-4">
              No categories yet. Add your first category!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}