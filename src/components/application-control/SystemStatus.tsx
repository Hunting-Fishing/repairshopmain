import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current system health and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Database</span>
            <span className="text-sm text-green-500">Connected</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">API Services</span>
            <span className="text-sm text-green-500">Operational</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Storage</span>
            <span className="text-sm text-green-500">Available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}