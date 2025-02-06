
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";

interface ParticipantsSectionProps {
  selectedStaffIds: string[];
  setSelectedStaffIds: (value: string[]) => void;
  maxParticipants: string;
  setMaxParticipants: (value: string) => void;
  staffOptions: { label: string; value: string; }[];
}

export function ParticipantsSection({
  selectedStaffIds,
  setSelectedStaffIds,
  maxParticipants,
  setMaxParticipants,
  staffOptions = [], // Provide default empty array
}: ParticipantsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Participants</Label>
        <MultiSelect
          options={staffOptions || []} // Ensure we always pass an array
          selected={selectedStaffIds || []} // Ensure we always pass an array
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
