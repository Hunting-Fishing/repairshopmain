
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Schedule = {
  id: string;
  schedule_type: "daily" | "weekly";
  day_of_week: string | null;
  time: string;
};

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const HOURS = Array.from({ length: 24 }, (_, i) => 
  i.toString().padStart(2, "0") + ":00"
);

export function BackupScheduleConfig() {
  const [dailyTime, setDailyTime] = useState<string>("");
  const [weeklyDay, setWeeklyDay] = useState<string>("");
  const [weeklyTime, setWeeklyTime] = useState<string>("");

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["backup-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("backup_schedule_config")
        .select("*");
      
      if (error) throw error;
      return data as Schedule[];
    },
    onSuccess: (data) => {
      const dailySchedule = data.find(s => s.schedule_type === "daily");
      const weeklySchedule = data.find(s => s.schedule_type === "weekly");
      
      if (dailySchedule) {
        setDailyTime(dailySchedule.time.substring(0, 5));
      }
      if (weeklySchedule) {
        setWeeklyDay(weeklySchedule.day_of_week || "");
        setWeeklyTime(weeklySchedule.time.substring(0, 5));
      }
    },
  });

  const updateSchedule = async (type: "daily" | "weekly", time: string, day?: string) => {
    try {
      const { error } = await supabase
        .from("backup_schedule_config")
        .update({
          time,
          day_of_week: day,
          updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("schedule_type", type);

      if (error) throw error;
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} backup schedule updated`);
    } catch (error: any) {
      toast.error(`Failed to update ${type} schedule: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading backup schedule configuration...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backup Schedule Configuration</CardTitle>
        <CardDescription>Configure automated database backup schedules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Daily Backup Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Daily Backup</h3>
          <div className="flex items-center gap-4">
            <Select
              value={dailyTime}
              onValueChange={(value) => {
                setDailyTime(value);
                updateSchedule("daily", value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Weekly Backup Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Weekly Backup</h3>
          <div className="flex items-center gap-4">
            <Select
              value={weeklyDay}
              onValueChange={setWeeklyDay}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={weeklyTime}
              onValueChange={setWeeklyTime}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={() => updateSchedule("weekly", weeklyTime, weeklyDay)}
              variant="outline"
            >
              Update Weekly Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
