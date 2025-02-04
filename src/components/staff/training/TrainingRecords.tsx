import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrainingDialog } from "./TrainingDialog";
import { TrainingTable } from "./components/TrainingTable";
import { useTrainingRecords } from "./hooks/useTrainingRecords";
import { useState } from "react";

export function TrainingRecords() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: trainings, isLoading } = useTrainingRecords();

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
        <TrainingTable trainings={trainings || []} />
      </CardContent>
      <TrainingDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </Card>
  );
}