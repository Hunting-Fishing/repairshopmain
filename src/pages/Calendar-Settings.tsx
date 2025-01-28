import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CalendarSettingsForm } from "@/components/calendar/settings/CalendarSettingsForm";

export default function CalendarSettings() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Calendar Settings"
        description="Customize your calendar appearance and behavior"
      />
      <div className="container mx-auto py-6">
        <CalendarSettingsForm />
      </div>
    </div>
  );
}