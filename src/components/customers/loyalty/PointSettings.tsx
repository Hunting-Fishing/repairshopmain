
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PointSettingsProps {
  pointsSettings: {
    earning: { dollars: number; points: number };
    redeeming: { points: number; dollars: number };
  };
  setPointsSettings: React.Dispatch<React.SetStateAction<{
    earning: { dollars: number; points: number };
    redeeming: { points: number; dollars: number };
  }>>;
}

export function PointSettings({ pointsSettings, setPointsSettings }: PointSettingsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-4">
        <h4 className="font-medium">Earning Points</h4>
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <div>
              <Label htmlFor="earning-dollars">$</Label>
              <Input
                id="earning-dollars"
                type="number"
                value={pointsSettings.earning.dollars}
                onChange={(e) => setPointsSettings(prev => ({
                  ...prev,
                  earning: { ...prev.earning, dollars: parseInt(e.target.value) }
                }))}
              />
            </div>
            <span className="mt-8">=</span>
            <div>
              <Label htmlFor="earning-points">Points</Label>
              <Input
                id="earning-points"
                type="number"
                value={pointsSettings.earning.points}
                onChange={(e) => setPointsSettings(prev => ({
                  ...prev,
                  earning: { ...prev.earning, points: parseInt(e.target.value) }
                }))}
              />
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <h4 className="font-medium">Redeeming Points</h4>
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2">
            <div>
              <Label htmlFor="redeeming-points">Points</Label>
              <Input
                id="redeeming-points"
                type="number"
                value={pointsSettings.redeeming.points}
                onChange={(e) => setPointsSettings(prev => ({
                  ...prev,
                  redeeming: { ...prev.redeeming, points: parseInt(e.target.value) }
                }))}
              />
            </div>
            <span className="mt-8">=</span>
            <div>
              <Label htmlFor="redeeming-dollars">$</Label>
              <Input
                id="redeeming-dollars"
                type="number"
                value={pointsSettings.redeeming.dollars}
                onChange={(e) => setPointsSettings(prev => ({
                  ...prev,
                  redeeming: { ...prev.redeeming, dollars: parseInt(e.target.value) }
                }))}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
