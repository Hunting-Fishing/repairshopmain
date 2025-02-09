
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecialtyList } from "./specialty/SpecialtyList";
import { SpecialtyForm } from "./specialty/SpecialtyForm";

interface Specialty {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
}

export function TechnicianSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const handleAddSpecialty = ({ name, level }: { name: string; level: string }) => {
    const newSpecialty = {
      id: crypto.randomUUID(),
      name,
      level: level as 'beginner' | 'intermediate' | 'expert',
    };
    setSpecialties([...specialties, newSpecialty]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Specialties Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SpecialtyForm onAdd={handleAddSpecialty} />
        <SpecialtyList specialties={specialties} />
      </CardContent>
    </Card>
  );
}
