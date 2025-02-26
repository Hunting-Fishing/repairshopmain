import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, Tag as TagIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CustomerTag } from "../types";

interface TagsListProps {
  customerId: string;
  className?: string;
}

export function TagsList({ customerId, className }: TagsListProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const { data: customerTags, refetch: refetchTags } = useQuery({
    queryKey: ["customer-tags", customerId],
    queryFn: async () => {
      const { data: assignments, error } = await supabase
        .from("customer_tag_assignments")
        .select(`
          tag:customer_tags(
            id,
            name,
            color
          )
        `)
        .eq("customer_id", customerId);

      if (error) throw error;
      return assignments.map(a => a.tag as CustomerTag);
    }
  });

  const { data: availableTags } = useQuery({
    queryKey: ["available-tags"],
    queryFn: async () => {
      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      const { data, error } = await supabase
        .from("customer_tags")
        .select("*")
        .eq("organization_id", userData?.organization_id);

      if (error) throw error;
      return data as CustomerTag[];
    }
  });

  const handleAddTag = async (tagId: string) => {
    try {
      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      const { error } = await supabase
        .from("customer_tag_assignments")
        .insert({
          customer_id: customerId,
          tag_id: tagId,
          assigned_by: profile.user?.id,
        });

      if (error) throw error;
      
      toast.success("Tag added successfully");
      refetchTags();
    } catch (error: any) {
      toast.error("Failed to add tag: " + error.message);
    }
  };

  const handleCreateTag = async () => {
    try {
      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      const { data, error } = await supabase
        .from("customer_tags")
        .insert({
          name: newTagName,
          organization_id: userData?.organization_id,
          created_by: profile.user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      await handleAddTag(data.id);
      setNewTagName("");
      setIsAddingTag(false);
    } catch (error: any) {
      toast.error("Failed to create tag: " + error.message);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from("customer_tag_assignments")
        .delete()
        .eq("customer_id", customerId)
        .eq("tag_id", tagId);

      if (error) throw error;
      
      toast.success("Tag removed successfully");
      refetchTags();
    } catch (error: any) {
      toast.error("Failed to remove tag: " + error.message);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {customerTags?.map((tag) => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
            style={tag.color ? { backgroundColor: tag.color } : undefined}
          >
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => handleRemoveTag(tag.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Dialog open={isAddingTag} onOpenChange={setIsAddingTag}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {availableTags?.map((tag) => (
                <Button
                  key={tag.id}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleAddTag(tag.id);
                    setIsAddingTag(false);
                  }}
                >
                  <TagIcon className="h-4 w-4" />
                  {tag.name}
                </Button>
              ))}
              <div className="relative">
                <Input
                  placeholder="Create new tag..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="pr-20"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1"
                  disabled={!newTagName.trim()}
                  onClick={handleCreateTag}
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
