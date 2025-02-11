
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TierSettings } from "./TierSettings";
import { PointSettings } from "./PointSettings";

export function LoyaltyTab() {
  const { toast } = useToast();
  const [tierSettings, setTierSettings] = useState({
    bronze: { min: 0, max: 1000 },
    silver: { min: 1001, max: 5000 },
    gold: { min: 5001, max: null }
  });
  const [pointsSettings, setPointsSettings] = useState({
    earning: { dollars: 1, points: 1 },
    redeeming: { points: 100, dollars: 5 }
  });

  const handleSaveSettings = () => {
    // TODO: Save settings to database
    toast({
      title: "Settings saved",
      description: "Your loyalty program settings have been updated."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loyalty Program Settings</CardTitle>
        <CardDescription>
          Configure your customer loyalty program settings and rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Tier System</h3>
          <TierSettings tierSettings={tierSettings} setTierSettings={setTierSettings} />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Point System</h3>
          <PointSettings pointsSettings={pointsSettings} setPointsSettings={setPointsSettings} />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
