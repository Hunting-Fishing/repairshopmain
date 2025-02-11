
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TierSettingsProps {
  tierSettings: {
    bronze: { min: number; max: number };
    silver: { min: number; max: number };
    gold: { min: number; max: null };
  };
  setTierSettings: React.Dispatch<React.SetStateAction<{
    bronze: { min: number; max: number };
    silver: { min: number; max: number };
    gold: { min: number; max: null };
  }>>;
}

export function TierSettings({ tierSettings, setTierSettings }: TierSettingsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <h4 className="font-medium">Bronze</h4>
        <div className="space-y-2 mt-2">
          <div>
            <Label htmlFor="bronze-min">Minimum Points</Label>
            <Input
              id="bronze-min"
              type="number"
              value={tierSettings.bronze.min}
              onChange={(e) => setTierSettings(prev => ({
                ...prev,
                bronze: { ...prev.bronze, min: parseInt(e.target.value) }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="bronze-max">Maximum Points</Label>
            <Input
              id="bronze-max"
              type="number"
              value={tierSettings.bronze.max}
              onChange={(e) => setTierSettings(prev => ({
                ...prev,
                bronze: { ...prev.bronze, max: parseInt(e.target.value) }
              }))}
            />
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <h4 className="font-medium">Silver</h4>
        <div className="space-y-2 mt-2">
          <div>
            <Label htmlFor="silver-min">Minimum Points</Label>
            <Input
              id="silver-min"
              type="number"
              value={tierSettings.silver.min}
              onChange={(e) => setTierSettings(prev => ({
                ...prev,
                silver: { ...prev.silver, min: parseInt(e.target.value) }
              }))}
            />
          </div>
          <div>
            <Label htmlFor="silver-max">Maximum Points</Label>
            <Input
              id="silver-max"
              type="number"
              value={tierSettings.silver.max}
              onChange={(e) => setTierSettings(prev => ({
                ...prev,
                silver: { ...prev.silver, max: parseInt(e.target.value) }
              }))}
            />
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <h4 className="font-medium">Gold</h4>
        <div className="space-y-2 mt-2">
          <div>
            <Label htmlFor="gold-min">Minimum Points</Label>
            <Input
              id="gold-min"
              type="number"
              value={tierSettings.gold.min}
              onChange={(e) => setTierSettings(prev => ({
                ...prev,
                gold: { ...prev.gold, min: parseInt(e.target.value) }
              }))}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
