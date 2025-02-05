
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunicationsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communications</CardTitle>
        <CardDescription>Manage chat rooms and communication settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* Chat rooms list will go here */}
            <div className="text-muted-foreground">Chat rooms coming soon...</div>
          </div>
          <div className="lg:col-span-9">
            {/* Active chat window will go here */}
            <div className="text-muted-foreground">Select a chat room to start messaging</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
