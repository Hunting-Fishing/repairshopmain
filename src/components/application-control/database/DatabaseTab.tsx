
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablesList } from "./TablesList";
import { StorageBucketsTab } from "./StorageBucketsTab";
import { VehicleDataTab } from "./VehicleDataTab";
import { JobTemplatesTab } from "./job-templates/JobTemplatesTab";
import { DatabaseIcon } from "lucide-react";

export function DatabaseTab() {
  return (
    <div className="space-y-4">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DatabaseIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Database Management
              </CardTitle>
              <CardDescription className="text-lg">
                View and manage database storage and tables
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="tables" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tables">Database Tables</TabsTrigger>
              <TabsTrigger value="buckets">Storage Buckets</TabsTrigger>
              <TabsTrigger value="vehicle-data">Vehicle Data</TabsTrigger>
              <TabsTrigger value="job-templates">Job Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="tables">
              <TablesList />
            </TabsContent>

            <TabsContent value="buckets">
              <StorageBucketsTab />
            </TabsContent>

            <TabsContent value="vehicle-data">
              <VehicleDataTab />
            </TabsContent>

            <TabsContent value="job-templates">
              <JobTemplatesTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
