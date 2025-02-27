
import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { 
  Settings, 
  Clock, 
  PaintBucket, 
  DollarSign, 
  Building, 
  UserCog, 
  Bell
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ShopSettings() {
  const [activeTab, setActiveTab] = useState("business");
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your shop settings have been updated successfully."
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Shop Settings</h1>
                <p className="text-muted-foreground">
                  Configure preferences for your organization
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="business" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="overflow-x-auto">
              <TabsList className="h-auto p-1 flex flex-nowrap min-w-max">
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>Business Information</span>
                </TabsTrigger>
                <TabsTrigger value="hours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Business Hours</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <PaintBucket className="h-4 w-4" />
                  <span>Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="rates" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Rates & Billing</span>
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span>Staff Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="business" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                  <CardDescription>Update your shop's basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input id="businessName" placeholder="Your Shop Name" defaultValue="Automotive Service Pro" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="(555) 123-4567" defaultValue="(555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email</Label>
                      <Input id="email" type="email" placeholder="info@yourshop.com" defaultValue="info@autoshop.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / Business Number</Label>
                      <Input id="taxId" placeholder="Tax ID" defaultValue="12-3456789" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="123 Main St" defaultValue="123 Main St" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" defaultValue="Springfield" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" placeholder="State" defaultValue="IL" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP/Postal Code</Label>
                      <Input id="zip" placeholder="ZIP Code" defaultValue="62701" />
                    </div>
                  </div>
                  
                  <Button onClick={handleSave}>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="hours" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>Set your shop's operating hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <div key={day} className="flex items-center justify-between border-b pb-2">
                        <span className="font-medium w-28">{day}</span>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="time" 
                            className="w-32" 
                            defaultValue={day === "Saturday" || day === "Sunday" ? "" : "09:00"} 
                          />
                          <span>to</span>
                          <Input 
                            type="time" 
                            className="w-32" 
                            defaultValue={day === "Saturday" || day === "Sunday" ? "" : "17:00"} 
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`closed-${day}`} className="cursor-pointer">Closed</Label>
                          <input 
                            type="checkbox" 
                            id={`closed-${day}`} 
                            className="h-4 w-4" 
                            defaultChecked={day === "Saturday" || day === "Sunday"} 
                          />
                        </div>
                      </div>
                    ))}
                    <Button onClick={handleSave}>Save Hours</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Appearance</CardTitle>
                  <CardDescription>Customize your shop's visual identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Shop Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 border rounded flex items-center justify-center bg-gray-100">
                        <Building className="h-10 w-10 text-gray-400" />
                      </div>
                      <Button variant="outline">Upload New Logo</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-3">
                      {["#ea384c", "#3b82f6", "#10b981", "#f97316", "#8b5cf6"].map((color) => (
                        <div 
                          key={color}
                          className="h-8 w-8 rounded-full cursor-pointer ring-offset-2 ring-offset-background"
                          style={{ backgroundColor: color, boxShadow: color === "#ea384c" ? "0 0 0 2px white, 0 0 0 4px #ea384c" : "none" }}
                        />
                      ))}
                      <Input type="color" defaultValue="#ea384c" className="w-8 h-8 p-0 cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-3">
                      {["#0EA5E9", "#64748b", "#6b7280", "#a3a3a3", "#f59e0b"].map((color) => (
                        <div 
                          key={color}
                          className="h-8 w-8 rounded-full cursor-pointer ring-offset-2 ring-offset-background"
                          style={{ backgroundColor: color, boxShadow: color === "#0EA5E9" ? "0 0 0 2px white, 0 0 0 4px #0EA5E9" : "none" }}
                        />
                      ))}
                      <Input type="color" defaultValue="#0EA5E9" className="w-8 h-8 p-0 cursor-pointer" />
                    </div>
                  </div>
                  
                  <Button onClick={handleSave}>Save Appearance</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Default Rates</CardTitle>
                  <CardDescription>Set standard pricing for your services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="laborRate">Default Labor Rate (per hour)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input id="laborRate" className="pl-7" defaultValue="85.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partsMarkup">Parts Markup Percentage</Label>
                      <div className="relative">
                        <Input id="partsMarkup" defaultValue="25" />
                        <span className="absolute right-3 top-2.5">%</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosticFee">Diagnostic Fee</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input id="diagnosticFee" className="pl-7" defaultValue="75.00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate</Label>
                      <div className="relative">
                        <Input id="taxRate" defaultValue="7.5" />
                        <span className="absolute right-3 top-2.5">%</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSave}>Save Rates</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="staff" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Settings</CardTitle>
                  <CardDescription>Configure preferences for staff members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h3 className="font-medium">Show Technician Workload</h3>
                        <p className="text-sm text-muted-foreground">Display work assignments for each technician</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border-b py-3">
                      <div>
                        <h3 className="font-medium">Enable Auto-Assignment</h3>
                        <p className="text-sm text-muted-foreground">Automatically assign jobs to technicians based on skill and availability</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" />
                    </div>
                    
                    <div className="flex items-center justify-between border-b py-3">
                      <div>
                        <h3 className="font-medium">Technician Specialties</h3>
                        <p className="text-sm text-muted-foreground">Enable management of technician specialties</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-medium">Technician Performance Metrics</h3>
                        <p className="text-sm text-muted-foreground">Track and display efficiency metrics for technicians</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" defaultChecked />
                    </div>
                  </div>
                  <Button onClick={handleSave}>Save Staff Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how and when notifications are sent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h3 className="font-medium">Appointment Reminders</h3>
                        <p className="text-sm text-muted-foreground">Send reminders to customers before appointments</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border-b py-3">
                      <div>
                        <h3 className="font-medium">Estimate Approvals</h3>
                        <p className="text-sm text-muted-foreground">Notify when estimates are approved by customers</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border-b py-3">
                      <div>
                        <h3 className="font-medium">Work Completion Notifications</h3>
                        <p className="text-sm text-muted-foreground">Send notifications when jobs are completed</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="font-medium">Low Inventory Alerts</h3>
                        <p className="text-sm text-muted-foreground">Get notified when inventory items are running low</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary h-5 w-10" defaultChecked />
                    </div>
                  </div>
                  <Button onClick={handleSave}>Save Notification Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
