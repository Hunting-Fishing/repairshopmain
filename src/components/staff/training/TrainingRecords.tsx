import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrainingDialog } from "./TrainingDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Training {
  id: string;
  training_name: string;
  description: string;
  completion_date: string | null;
  expiry_date: string | null;
  status: string;
}

export function TrainingRecords() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: trainings, isLoading } = useQuery({
    queryKey: ["staff-training"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("staff_training")
        .select("*")
        .eq("profile_id", session.user.id);

      if (error) throw error;
      return data as Training[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Records</CardTitle>
          <CardDescription>Loading training records...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Training Records</CardTitle>
            <CardDescription>View and manage your training records</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Training
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Training Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Completion Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings?.map((training) => (
              <TableRow key={training.id}>
                <TableCell className="font-medium">{training.training_name}</TableCell>
                <TableCell>{training.description}</TableCell>
                <TableCell>
                  {training.completion_date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(training.completion_date), "PP")}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {training.expiry_date && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {format(new Date(training.expiry_date), "PP")}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={training.status === "completed" ? "default" : "secondary"}>
                    {training.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <TrainingDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </Card>
  );
}