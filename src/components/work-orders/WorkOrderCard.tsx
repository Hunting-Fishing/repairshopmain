
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface WorkOrderProps {
  workOrder: {
    id: string;
    customer: {
      name: string;
      phone: string;
    };
    vehicle: {
      make: string;
      model: string;
    };
  };
}

export function WorkOrderCard({ workOrder }: WorkOrderProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Work Order #{workOrder.id}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <p>{workOrder.customer.name}</p>
            <p className="text-muted-foreground">{workOrder.customer.phone}</p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-2">Vehicle Information</h3>
            <p>{workOrder.vehicle.make} {workOrder.vehicle.model}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Actions</h3>
            <div className="flex gap-2">
              <Button variant="outline">Add Labor</Button>
              <Button variant="outline">Add Parts</Button>
              <Button variant="outline">Add Notes</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
