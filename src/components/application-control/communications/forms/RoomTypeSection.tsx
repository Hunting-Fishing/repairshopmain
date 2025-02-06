
import { Label } from "@/components/ui/label";
import { RoomType } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Folder, MessageSquare } from "lucide-react";
import { useChatRoomForm } from "./ChatRoomFormContext";

export function RoomTypeSection() {
  const { roomType, setRoomType, type, setType } = useChatRoomForm();

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
        <Label htmlFor="type">Category</Label>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="announcements">Announcements</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
