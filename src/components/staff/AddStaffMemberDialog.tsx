
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useAddStaffMember, StaffMemberFormValues } from "@/hooks/staff/useAddStaffMember";
import { toast } from "@/components/ui/use-toast";
import { roles } from "./role-management/types";

interface AddStaffMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStaffMemberDialog({ 
  isOpen, 
  onClose, 
  onSuccess 
}: AddStaffMemberDialogProps) {
  const { user } = useAuth();
  const { data: userProfile } = useProfile(user?.id);
  const { addStaffMember, isLoading } = useAddStaffMember();
  
  const [formData, setFormData] = useState<StaffMemberFormValues>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'technician',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Map the form field names to the StaffMemberFormValues property names
    const fieldMap: Record<string, keyof StaffMemberFormValues> = {
      'first_name': 'firstName',
      'last_name': 'lastName',
      'phone_number': 'phoneNumber',
    };
    
    const propertyName = fieldMap[name] || name as keyof StaffMemberFormValues;
    setFormData(prev => ({ ...prev, [propertyName]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile?.organization_id) {
      toast({
        title: "Error",
        description: "Organization ID not found. Please try again later.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addStaffMember({
        ...formData,
        organization_id: userProfile.organization_id
      });
      toast({
        title: "Staff member added",
        description: `${formData.firstName} ${formData.lastName} has been added to your organization.`,
        variant: "default"
      });
      onSuccess();
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: 'technician',
      });
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast({
        title: "Error",
        description: "Failed to add staff member. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value) => handleSelectChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {role.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              defaultValue="active" 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Staff Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
