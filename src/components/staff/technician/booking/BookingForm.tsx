
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSpecialties } from "@/hooks/staff/useSpecialties";
import { useAutoAssignment } from "@/hooks/staff/useAutoAssignment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BookingFormData {
  customerName: string;
  description: string;
  requiredSpecialties: string[];
  minimumLevel: 'beginner' | 'intermediate' | 'expert';
}

export function BookingForm() {
  const { specialties } = useSpecialties();
  const { assignTechnician } = useAutoAssignment();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const { register, handleSubmit } = useForm<BookingFormData>();

  const onSubmit = async (data: BookingFormData) => {
    try {
      // Create booking logic here
      // Then auto-assign technician
      await assignTechnician.mutateAsync({
        bookingId: "BOOKING_ID", // Replace with actual booking ID
        requiredSpecialties: selectedSpecialties
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const toggleSpecialty = (specialtyId: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialtyId)
        ? prev.filter(id => id !== specialtyId)
        : [...prev, specialtyId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input {...register('customerName')} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...register('description')} />
          </div>

          <div className="space-y-2">
            <Label>Required Specialties</Label>
            <div className="space-y-2">
              {specialties?.map((specialty) => (
                <div key={specialty.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedSpecialties.includes(specialty.id)}
                    onCheckedChange={() => toggleSpecialty(specialty.id)}
                  />
                  <Label>{specialty.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Minimum Specialty Level</Label>
            <Select {...register('minimumLevel')}>
              <SelectTrigger>
                <SelectValue placeholder="Select minimum level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">Create Booking</Button>
        </form>
      </CardContent>
    </Card>
  );
}
