
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

interface RepairJobDetailsData {
  customer: {
    first_name: string;
    last_name: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: string;
  };
  description: string;
  created_at: string;
  technician: {
    first_name: string;
    last_name: string;
  } | null;
  quoted_amount: number;
  approved_amount: number;
  actual_amount: number;
}

interface BasicDetailsProps {
  data: RepairJobDetailsData;
}

export function BasicDetails({ data }: BasicDetailsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data.customer.first_name} {data.customer.last_name}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {data.vehicle.year} {data.vehicle.make} {data.vehicle.model}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Description:</strong> {data.description}</p>
            <p><strong>Created:</strong> {format(new Date(data.created_at), 'PPp')}</p>
            {data.technician && (
              <p>
                <strong>Technician:</strong> {data.technician.first_name} {data.technician.last_name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Quoted Amount:</strong> {formatCurrency(data.quoted_amount)}</p>
            {data.approved_amount && (
              <p><strong>Approved Amount:</strong> {formatCurrency(data.approved_amount)}</p>
            )}
            {data.actual_amount && (
              <p><strong>Actual Amount:</strong> {formatCurrency(data.actual_amount)}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
