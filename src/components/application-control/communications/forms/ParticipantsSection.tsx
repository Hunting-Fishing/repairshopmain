
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { useChatRoomForm } from "./ChatRoomFormContext";

interface ParticipantsSectionProps {
  staffOptions: { label: string; value: string; }[];
}

export function ParticipantsSection({ staffOptions }: ParticipantsSectionProps) {
  const { 
    selectedStaffIds,
    setSelectedStaffIds,
    maxParticipants,
    setMaxParticipants
  } = useChatRoomForm();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Participants</Label>
        <MultiSelect
          options={staffOptions}
          selected={selectedStaffIds}
          onChange={setSelectedStaffIds}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxParticipants">Maximum Participants (Optional)</Label>
        <Input
          id="maxParticipants"
          type="number"
          min="2"
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          placeholder="Leave empty for unlimited"
        />
      </div>
    </div>
  );
}
