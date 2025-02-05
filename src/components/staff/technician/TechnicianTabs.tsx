import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { TechnicianSettings } from "./TechnicianSettings";
import { TechnicianSpecialties } from "./TechnicianSpecialties";
import { TechnicianAvailability } from "./TechnicianAvailability";
import { TechnicianHeader } from "./components/TechnicianHeader";
import { TechnicianTabsList } from "./components/TechnicianTabsList";
import { useTechnicianTabs } from "./hooks/useTechnicianTabs";

export default function TechnicianTabs() {
  const form = useTechnicianTabs();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <TechnicianHeader />
      <Tabs defaultValue="settings" className="space-y-6">
        <TechnicianTabsList />
        <TabsContent value="settings">
          <Form {...form}>
            <form className="space-y-8">
              <TechnicianSettings form={form} />
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="specialties">
          <TechnicianSpecialties />
        </TabsContent>
        <TabsContent value="availability">
          <TechnicianAvailability />
        </TabsContent>
      </Tabs>
    </div>
  );
}