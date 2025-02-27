
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StaffMember } from "@/types/staff";
import { getRoleBadgeColor } from "./role-management/types";
import { 
  User, Phone, Mail, Calendar, Award, 
  Clock, FileText, BookOpen, BarChart4,
  Briefcase, Star
} from "lucide-react";
import { format } from "date-fns";

interface StaffProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember: StaffMember | null;
}

export function StaffProfileView({ isOpen, onClose, staffMember }: StaffProfileViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!staffMember) return null;

  const fullName = `${staffMember.first_name} ${staffMember.last_name}`;
  const initials = `${staffMember.first_name?.[0] || ''}${staffMember.last_name?.[0] || ''}`;
  
  // Mock data for demonstrations - replace with real data when available
  const skills = staffMember.skills || [];
  const certifications = staffMember.certifications || [];
  const performanceMetrics = {
    efficiency: 87,
    customerSatisfaction: 92,
    tasksCompleted: 156,
    averageJobTime: "2.4 hours"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            Staff Profile
          </DialogTitle>
          <DialogDescription>
            Detailed information about {fullName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{fullName}</h3>
                      <Badge className={getRoleBadgeColor(staffMember.role)}>
                        {staffMember.custom_roles?.name || staffMember.role.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        {staffMember.status === 'active' ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    
                    <div className="grid w-full gap-1 mt-2">
                      {staffMember.email && (
                        <a href={`mailto:${staffMember.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                          <Mail className="h-4 w-4" />
                          {staffMember.email}
                        </a>
                      )}
                      {staffMember.phone_number && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          {staffMember.phone_number}
                        </div>
                      )}
                      {staffMember.hire_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          Hired: {format(new Date(staffMember.hire_date), 'PPP')}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="skills">Skills & Certs</TabsTrigger>
                  <TabsTrigger value="history">Work History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Name:</span>
                        <span className="col-span-2">{fullName}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Role:</span>
                        <span className="col-span-2">{staffMember.custom_roles?.name || staffMember.role.replace('_', ' ')}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Status:</span>
                        <span className="col-span-2">{staffMember.status}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="col-span-2">{staffMember.email}</span>
                      </div>
                      <div className="grid grid-cols-3">
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="col-span-2">{staffMember.phone_number}</span>
                      </div>
                      {staffMember.hire_date && (
                        <div className="grid grid-cols-3">
                          <span className="text-sm font-medium">Hire Date:</span>
                          <span className="col-span-2">{format(new Date(staffMember.hire_date), 'PPP')}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {staffMember.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{staffMember.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {staffMember.emergency_contact && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Emergency Contact</CardTitle>
                      </CardHeader>
                      <CardContent className="grid gap-2">
                        <div className="grid grid-cols-3">
                          <span className="text-sm font-medium">Name:</span>
                          <span className="col-span-2">{staffMember.emergency_contact.name}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-sm font-medium">Phone:</span>
                          <span className="col-span-2">{staffMember.emergency_contact.phone}</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-sm font-medium">Relationship:</span>
                          <span className="col-span-2">{staffMember.emergency_contact.relationship}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <BarChart4 className="h-4 w-4" />
                            Efficiency Score
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{performanceMetrics.efficiency}%</div>
                        <Progress value={performanceMetrics.efficiency} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Customer Satisfaction
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{performanceMetrics.customerSatisfaction}%</div>
                        <Progress value={performanceMetrics.customerSatisfaction} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Tasks Completed
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{performanceMetrics.tasksCompleted}</div>
                        <p className="text-xs text-muted-foreground">
                          Past 90 days
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Average Job Time
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{performanceMetrics.averageJobTime}</div>
                        <p className="text-xs text-muted-foreground">
                          Past 30 days
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance History</CardTitle>
                      <CardDescription>Performance metrics over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        Performance chart will be displayed here
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="skills" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Skills
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No skills recorded</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Certifications
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {certifications.length > 0 ? (
                        <div className="space-y-3">
                          {certifications.map((cert, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="font-medium">{cert.name}</div>
                              <div className="flex justify-between text-sm">
                                <span>Issued: {format(new Date(cert.date), 'MMM d, yyyy')}</span>
                                {cert.expiry && (
                                  <span>Expires: {format(new Date(cert.expiry), 'MMM d, yyyy')}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No certifications recorded</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Training
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">No training records found</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Work History</CardTitle>
                      <CardDescription>Recent work completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">No work history records found</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Edit Profile</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
