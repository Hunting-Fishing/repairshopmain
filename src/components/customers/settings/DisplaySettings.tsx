import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette, Eye } from "lucide-react";

interface DisplaySettingsProps {
  theme: string;
  setTheme: (value: string) => void;
  showAvatars: boolean;
  setShowAvatars: (value: boolean) => void;
  showStatus: boolean;
  setShowStatus: (value: boolean) => void;
  density: string;
  setDensity: (value: string) => void;
}

export function DisplaySettings({
  theme,
  setTheme,
  showAvatars,
  setShowAvatars,
  showStatus,
  setShowStatus,
  density,
  setDensity,
}: DisplaySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Settings</CardTitle>
        <CardDescription>
          Customize the visual appearance of customer information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Theme</h3>
            <RadioGroup
              value={theme}
              onValueChange={setTheme}
              className="flex gap-4"
            >
              {["light", "dark", "system"].map((t) => (
                <div key={t} className="flex items-center space-x-2">
                  <RadioGroupItem value={t} id={`theme-${t}`} />
                  <Label htmlFor={`theme-${t}`} className="capitalize">
                    <div className="flex items-center gap-1">
                      <Palette className="h-4 w-4" />
                      {t}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Density</h3>
            <RadioGroup
              value={density}
              onValueChange={setDensity}
              className="flex gap-4"
            >
              {["comfortable", "compact", "spacious"].map((d) => (
                <div key={d} className="flex items-center space-x-2">
                  <RadioGroupItem value={d} id={`density-${d}`} />
                  <Label htmlFor={`density-${d}`} className="capitalize">
                    {d}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-avatars">Show Avatars</Label>
              <p className="text-sm text-muted-foreground">
                Display customer profile pictures
              </p>
            </div>
            <Switch
              id="show-avatars"
              checked={showAvatars}
              onCheckedChange={setShowAvatars}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-status">Show Status</Label>
              <p className="text-sm text-muted-foreground">
                Display customer status indicators
              </p>
            </div>
            <Switch
              id="show-status"
              checked={showStatus}
              onCheckedChange={setShowStatus}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}