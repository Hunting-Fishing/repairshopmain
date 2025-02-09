
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    id: "customer_name",
    header: "Customer",
    cell: (row: any) => row.customer_name,
  },
  {
    id: "start_time",
    header: "Date & Time",
    cell: (row: any) => format(new Date(row.start_time), "PPp"),
  },
  {
    id: "job_description",
    header: "Service",
    cell: (row: any) => row.job_description,
  },
  {
    id: "status",
    header: "Status",
    cell: (row: any) => (
      <Badge variant={row.status === "completed" ? "success" : "default"}>
        {row.status || "scheduled"}
      </Badge>
    ),
  },
  {
    id: "technician",
    header: "Technician",
    cell: (row: any) => 
      row.profiles ? 
      `${row.profiles.first_name} ${row.profiles.last_name}` : 
      "Unassigned",
  },
];
