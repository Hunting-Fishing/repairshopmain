import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneralViewSettings } from "./form-sections/GeneralViewSettings";
import { GeneralTimeSettings } from "./form-sections/GeneralTimeSettings";
import { FormSectionProps } from "./types";

export function GeneralSettings({ form }: FormSectionProps) {
  return (
    <Card className="border-[#FEC6A1]">
      <CardHeader className="bg-[#FDE1D3] rounded-t-lg">
        <CardTitle>General Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <GeneralViewSettings />
        <GeneralTimeSettings />
      </CardContent>
    </Card>
  );
}