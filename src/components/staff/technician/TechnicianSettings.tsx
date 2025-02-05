import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { technicianSettingsFormSchema, type TechnicianSettingsFormValues } from "../types";

export function TechnicianSettings({ form }: { form: ReturnType<typeof useForm<TechnicianSettingsFormValues>> }) {
  const onSubmit = async (data: TechnicianSettingsFormValues) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>
            <input type="checkbox" {...form.register("showTechnicianWorkload")} />
            Show Technician Workload
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...form.register("showTechnicianAvailability")} />
            Show Technician Availability
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...form.register("showTechnicianStats")} />
            Show Technician Stats
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...form.register("enableAutoAssignment")} />
            Enable Auto Assignment
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...form.register("enableTechnicianSpecialties")} />
            Enable Technician Specialties
          </label>
        </div>
        <div>
          <label>
            <select {...form.register("technicianScheduleConflictHandling")}>
              <option value="warn">Warn</option>
              <option value="block">Block</option>
              <option value="allow">Allow</option>
            </select>
            Technician Schedule Conflict Handling
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" {...form.register("enableTechnicianColors")} />
            Enable Technician Colors
          </label>
        </div>
        <div>
          <label>
            <select {...form.register("technicianViewMode")}>
              <option value="individual">Individual</option>
              <option value="combined">Combined</option>
              <option value="filtered">Filtered</option>
            </select>
            Technician View Mode
          </label>
        </div>
        <div>
          <label>
            <input type="number" {...form.register("maxDailyBookings")} min={1} max={24} />
            Max Daily Bookings
          </label>
        </div>
        <div>
          <label>
            <input type="text" {...form.register("preferredWorkTypes")} placeholder="Preferred Work Types (comma separated)" />
            Preferred Work Types
          </label>
        </div>
        <div>
          <Button type="submit">Save Settings</Button>
        </div>
      </form>
    </Form>
  );
}
