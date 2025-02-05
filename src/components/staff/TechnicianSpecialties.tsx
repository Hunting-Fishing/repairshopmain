import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillCategories } from "./skills/SkillCategories";

export function TechnicianSpecialties() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Specialties</CardTitle>
      </CardHeader>
      <CardContent>
        <SkillCategories />
      </CardContent>
    </Card>
  );
}