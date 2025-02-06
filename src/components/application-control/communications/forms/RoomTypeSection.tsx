
import { Label } from "@/components/ui/label";
import { RoomType } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Folder, MessageSquare, Plus } from "lucide-react";
import { useChatRoomForm } from "./ChatRoomFormContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function RoomTypeSection() {
  const { roomType, setRoomType, type, setType } = useChatRoomForm();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  const getRoomTypeIcon = (type: RoomType) => {
    switch (type) {
      case "direct":
        return <Users className="h-4 w-4 mr-2" />;
      case "work_order":
        return <Folder className="h-4 w-4 mr-2" />;
      case "group":
        return <Users className="h-4 w-4 mr-2" />;
      default:
        return <MessageSquare className="h-4 w-4 mr-2" />;
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) {
      toast.error("You must be logged in to add categories");
      return;
    }

    // Add the new category to local state first
    setCustomCategories([...customCategories, newCategory.toLowerCase()]);
    setType(newCategory.toLowerCase());
    setNewCategory("");
    setIsAddingCategory(false);
    toast.success("Category added successfully");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="roomType">Room Type</Label>
        <Select value={roomType} onValueChange={(value: RoomType) => setRoomType(value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">
              {getRoomTypeIcon("general")}
              General Chat
            </SelectItem>
            <SelectItem value="direct">
              {getRoomTypeIcon("direct")}
              Direct Message
            </SelectItem>
            <SelectItem value="work_order">
              {getRoomTypeIcon("work_order")}
              Work Order Discussion
            </SelectItem>
            <SelectItem value="group">
              {getRoomTypeIcon("group")}
              Group Chat
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="type">Category</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAddingCategory(true)}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="announcements">Announcements</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            {customCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingCategory(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>
                Add Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
