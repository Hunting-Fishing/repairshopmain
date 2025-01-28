import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { GeneralSettings } from "./GeneralSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { SchedulingSettings } from "./SchedulingSettings";
import { calendarSettingsFormSchema, type CalendarSettingsFormValues } from "./types";

export function CalendarSettingsForm() {
  const form = useForm<CalendarSettingsFormValues>({
    resolver: zodResolver(calendarSettingsFormSchema),
    defaultValues: {
      defaultView: "week",
      use24HourTime: false,
      workingHoursStart: "09:00",
      workingHoursEnd: "17:00",
      timeIncrement: "30",
      theme: "warm",
      allowOverlappingBookings: false,
      bufferBefore: "0",
      bufferAfter: "0",
      primaryColor: "#FEC6A1",
      secondaryColor: "#FDE1D3",
    },
  });

  function onSubmit(values: CalendarSettingsFormValues) {
    toast({
      title: "Settings updated",
      description: "Your calendar settings have been saved successfully.",
    });
    console.log(values);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general">
              <GeneralSettings form={form} />
            </TabsContent>

            <TabsContent value="appearance">
              <AppearanceSettings form={form} />
            </TabsContent>

            <TabsContent value="scheduling">
              <SchedulingSettings form={form} />
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Notification settings will be implemented in the next phase
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" className="bg-[#FEC6A1] hover:bg-[#FDE1D3] text-gray-800">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}