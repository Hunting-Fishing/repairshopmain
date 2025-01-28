import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralViewSettings } from "@/components/calendar/settings/form-sections/GeneralViewSettings";
import { GeneralTimeSettings } from "@/components/calendar/settings/form-sections/GeneralTimeSettings";
import { SchedulingRules } from "@/components/calendar/settings/form-sections/SchedulingRules";
import { BufferSettings } from "@/components/calendar/settings/form-sections/BufferSettings";
import { AppearanceSettings } from "@/components/calendar/settings/AppearanceSettings";

const formSchema = z.object({
  defaultView: z.enum(["day", "week", "month"]),
  use24HourTime: z.boolean(),
  workingHoursStart: z.string(),
  workingHoursEnd: z.string(),
  timeIncrement: z.string(),
  allowOverlappingBookings: z.boolean(),
  bufferBefore: z.string(),
  bufferAfter: z.string(),
  theme: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

export default function CalendarSettings() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultView: "week",
      use24HourTime: false,
      workingHoursStart: "09",
      workingHoursEnd: "17",
      timeIncrement: "30",
      allowOverlappingBookings: false,
      bufferBefore: "0",
      bufferAfter: "0",
      theme: "light",
      primaryColor: "#3b82f6",
      secondaryColor: "#f59e0b",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar Settings</h1>
        <p className="text-muted-foreground">
          Customize your calendar preferences and scheduling rules
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">View Settings</h3>
                    <GeneralViewSettings />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Time Settings</h3>
                    <GeneralTimeSettings />
                  </div>
                </TabsContent>

                <TabsContent value="appearance">
                  <AppearanceSettings />
                </TabsContent>

                <TabsContent value="scheduling" className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Scheduling Rules</h3>
                    <SchedulingRules />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Buffer Settings</h3>
                    <BufferSettings />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}