
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSpecialties } from "@/hooks/staff/useSpecialties";
import { useEnhancedAutoAssignment } from "@/hooks/staff/useEnhancedAutoAssignment";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface BookingFormData {
  customerName: string;
  description: string;
  requiredSpecialties: string[];
  minimumLevel: 'beginner' | 'intermediate' | 'expert';
  isEmergency: boolean;
  priority: 'low' | 'normal' | 'high';
  complexity: 'standard' | 'complex' | 'expert';
}

export function EnhancedBookingForm() {
  const { specialties } = useSpecialties();
  const { assignTechnician, workloadStats } = useEnhancedAutoAssignment();
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const { register, handleSubmit, watch } = useForm<BookingFormData>();
  const isEmergency = watch('isEmergency');

  const onSubmit = async (data: BookingFormData) => {
    try {
      // Create booking logic here
      const bookingId = "BOOKING_ID"; // Replace with actual booking ID
      
      await assignTechnician.mutateAsync({
        bookingId,
        requiredSpecialties: selectedSpecialties,
        minimumLevel: data.minimumLevel,
        isEmergency: data.isEmergency
      });

      toast.success("Booking created successfully");
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Failed to create booking");
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
        <CardTitle>Create Enhanced Booking</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input {...register('customerName')} required />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...register('description')} required />
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

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <Select {...register('priority')}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Complexity Level</Label>
            <Select {...register('complexity')}>
              <SelectTrigger>
                <SelectValue placeholder="Select complexity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="complex">Complex</SelectItem>
                <SelectItem value="expert">Expert Required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              {...register('isEmergency')}
              id="isEmergency"
            />
            <Label htmlFor="isEmergency">Emergency Booking</Label>
          </div>

          {isEmergency && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-800 text-sm">
                Emergency bookings will be prioritized in the auto-assignment system.
              </p>
            </div>
          )}

          <Button type="submit" disabled={assignTechnician.isPending}>
            {assignTechnician.isPending ? "Creating..." : "Create Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
