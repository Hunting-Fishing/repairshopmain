
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TierSettings } from "./TierSettings";
import { PointSettings } from "./PointSettings";
import { useLoyaltySettings } from "./hooks/useLoyaltySettings";
import { Skeleton } from "@/components/ui/skeleton";

export function LoyaltyTab() {
  const { settings, isLoading, updateSettings } = useLoyaltySettings();

  const handleSaveSettings = () => {
    updateSettings.mutate({
      tier_settings: tierSettings,
      point_settings: pointsSettings,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-[150px] mb-2" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-[150px]" />
              <Skeleton className="h-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const [tierSettings, setTierSettings] = useState(
    settings?.tier_settings || {
      bronze: { min: 0, max: 1000 },
      silver: { min: 1001, max: 5000 },
      gold: { min: 5001, max: null }
    }
  );

  const [pointsSettings, setPointsSettings] = useState(
    settings?.point_settings || {
      earning: { dollars: 1, points: 1 },
      redeeming: { points: 100, dollars: 5 }
    }
  );

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
          <Button 
            onClick={handleSaveSettings} 
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
