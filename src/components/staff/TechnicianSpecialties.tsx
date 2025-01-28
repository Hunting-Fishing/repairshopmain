import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TechnicianSpecialties() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Specialties</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Specialty management will be implemented in the next phase
        </p>
      </CardContent>
    </Card>
  );
}