
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { useChatRoomForm } from "./ChatRoomFormContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface ParticipantsSectionProps {
  staffOptions: { label: string; value: string; }[];
}

export function ParticipantsSection({ staffOptions }: ParticipantsSectionProps) {
  const { 
    selectedStaffIds,
    setSelectedStaffIds,
    maxParticipants,
    setMaxParticipants,
    roomType
  } = useChatRoomForm();

  const { user } = useAuth();

  // Filter out the current user from the options
  const filteredStaffOptions = staffOptions.filter(
    option => option.value !== user?.id
  );

  // For direct messages, ensure only one participant can be selected
  useEffect(() => {
    if (roomType === 'direct' && selectedStaffIds.length > 1) {
      setSelectedStaffIds([selectedStaffIds[0]]);
    }
  }, [roomType, selectedStaffIds, setSelectedStaffIds]);

  // Display label based on room type
  const participantsLabel = roomType === 'direct' 
    ? "Select participant" 
    : "Select participants";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{participantsLabel}</Label>
        <MultiSelect
          options={filteredStaffOptions}
          selected={selectedStaffIds}
          onChange={setSelectedStaffIds}
          className="w-full"
          disabled={roomType === 'direct' && selectedStaffIds.length === 1}
        />
        {roomType === 'direct' && (
          <p className="text-sm text-muted-foreground">
            Current user will be automatically included
          </p>
        )}
      </div>

      {roomType !== 'direct' && (
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
      )}
    </div>
  );
}
