
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecialtyList } from "./specialty/SpecialtyList";
import { SpecialtyForm } from "./specialty/SpecialtyForm";
import { useSpecialties } from "@/hooks/staff/useSpecialties";
import { useSpecialtyAssignments } from "@/hooks/staff/useSpecialtyAssignments";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TechnicianSpecialtiesProps {
  technicianId?: string;
}

export function TechnicianSpecialties({ technicianId }: TechnicianSpecialtiesProps) {
  const { specialties, isLoading: specialtiesLoading, addSpecialty } = useSpecialties();
  const { 
    assignments, 
    isLoading: assignmentsLoading,
    assignSpecialty,
    removeAssignment 
  } = useSpecialtyAssignments(technicianId || '');

  const handleAddSpecialty = async ({ name, level }: { name: string; level: string }) => {
    try {
      await addSpecialty.mutateAsync({ 
        name,
        description: `${level} level specialty` 
      });
    } catch (error) {
      console.error('Error adding specialty:', error);
    }
  };

  if (specialtiesLoading || assignmentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!specialties) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load specialties
        </AlertDescription>
      </Alert>
    );
  }

  const assignedSpecialties = assignments?.map(assignment => ({
    id: assignment.id,
    name: assignment.specialty.name,
    level: assignment.specialty.level
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialties Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SpecialtyForm onAdd={handleAddSpecialty} />
        <SpecialtyList 
          specialties={assignedSpecialties}
          onRemove={technicianId ? removeAssignment.mutate : undefined}
        />
      </CardContent>
    </Card>
  );
}
