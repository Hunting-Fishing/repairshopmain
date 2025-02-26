
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download, FileSpreadsheet, FileText, PieChart as PieChartIcon } from "lucide-react";
import { useStaffMembers } from "@/hooks/staff/useStaffMembers";

interface PerformanceReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PerformanceReports({ isOpen, onClose }: PerformanceReportsProps) {
  const [reportType, setReportType] = useState("efficiency");
  const [timeRange, setTimeRange] = useState("month");
  const { data: staffMembers, isLoading } = useStaffMembers();

  // Process staff data for efficiency chart
  const efficiencyData = staffMembers.map((staff, index) => {
    // In a real app, you'd use actual efficiency data from your database
    // For now we'll generate some random but consistent data based on index
    const efficiency = 95 - (index * 3);
    const tasks = 45 - (index * 4);
    return {
      name: `${staff.first_name || ''} ${staff.last_name || ''}`.trim() || `Staff ${index + 1}`,
      efficiency: efficiency > 0 ? efficiency : 70,
      tasks: tasks > 0 ? tasks : 10
    };
  });
  
  // Sample historical data - in a real app, you would fetch this from your database
  const timePerformanceData = [
    { date: '2023-06', efficiency: 80, satisfaction: 85 },
    { date: '2023-07', efficiency: 82, satisfaction: 87 },
    { date: '2023-08', efficiency: 79, satisfaction: 84 },
    { date: '2023-09', efficiency: 85, satisfaction: 89 },
    { date: '2023-10', efficiency: 88, satisfaction: 90 },
    { date: '2023-11', efficiency: 86, satisfaction: 88 },
    { date: '2023-12', efficiency: 90, satisfaction: 91 },
    { date: '2024-01', efficiency: 89, satisfaction: 92 },
  ];
  
  // Process staff data for role distribution chart
  const roleMap: Record<string, number> = {};
  staffMembers.forEach(staff => {
    const role = staff.custom_roles?.name || staff.role || 'Unassigned';
    roleMap[role] = (roleMap[role] || 0) + 1;
  });
  
  const roleWorkloadData = Object.entries(roleMap).map(([name, count]) => ({
    name,
    workload: count
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const handleExportReport = () => {
    // Logic to export report data would go here
    console.log("Exporting report...");
  };

  // Render the appropriate chart title based on report type
  const getChartTitle = () => {
    if (reportType === 'efficiency') return 'Staff Efficiency Analysis';
    if (reportType === 'historical') return 'Historical Performance Metrics';
    return 'Workload Distribution by Role';
  };

  // Find top performer from efficiency data
  const getTopPerformer = () => {
    if (efficiencyData.length === 0) return { name: 'N/A', efficiency: 0 };
    return efficiencyData.reduce((prev, current) => 
      (prev.efficiency > current.efficiency) ? prev : current
    );
  };

  // Calculate team average efficiency
  const getTeamAverage = () => {
    if (efficiencyData.length === 0) return 0;
    const sum = efficiencyData.reduce((total, staff) => total + staff.efficiency, 0);
    return Math.round(sum / efficiencyData.length);
  };

  const topPerformer = getTopPerformer();
  const teamAverage = getTeamAverage();

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Staff Performance Reports</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">Loading staff data...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Staff Performance Reports</DialogTitle>
          <DialogDescription>
            View and analyze staff performance metrics
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
            <div className="space-y-2 flex-1">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efficiency">Efficiency Analysis</SelectItem>
                  <SelectItem value="historical">Historical Performance</SelectItem>
                  <SelectItem value="workload">Workload Distribution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex-1">
              <Label htmlFor="time-range">Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="time-range">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="flex items-center gap-1" onClick={handleExportReport}>
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
          
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{getChartTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {reportType === 'efficiency' && (
                        <BarChart
                          data={efficiencyData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar name="Efficiency Score (%)" dataKey="efficiency" fill="#8884d8" />
                          <Bar name="Tasks Completed" dataKey="tasks" fill="#82ca9d" />
                        </BarChart>
                      )}
                      
                      {reportType === 'historical' && (
                        <LineChart
                          data={timePerformanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="efficiency" 
                            name="Team Efficiency"
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="satisfaction" 
                            name="Customer Satisfaction"
                            stroke="#82ca9d" 
                          />
                        </LineChart>
                      )}
                      
                      {reportType === 'workload' && (
                        <PieChart>
                          <Pie
                            data={roleWorkloadData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="workload"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {roleWorkloadData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}`, 'Staff Count']} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Report Format</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Excel (.xlsx)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <FileText className="h-4 w-4" />
                      <span>CSV (.csv)</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <PieChartIcon className="h-4 w-4" />
                      <span>Interactive Dashboard</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Top Performer</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{topPerformer.name}</div>
                    <div className="text-sm text-muted-foreground">{topPerformer.efficiency}% efficiency</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Team Average</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{teamAverage}%</div>
                    <div className="text-sm text-muted-foreground">
                      {teamAverage > 80 ? "Above target" : "Below target"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="table">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Data Table</CardTitle>
                </CardHeader>
                <CardContent>
                  {reportType === 'efficiency' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Name</th>
                            <th className="text-right py-2 px-4">Efficiency Score</th>
                            <th className="text-right py-2 px-4">Tasks Completed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {efficiencyData.map((staff, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-4">{staff.name}</td>
                              <td className="text-right py-2 px-4">{staff.efficiency}%</td>
                              <td className="text-right py-2 px-4">{staff.tasks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {reportType === 'workload' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Role</th>
                            <th className="text-right py-2 px-4">Staff Count</th>
                            <th className="text-right py-2 px-4">Distribution (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roleWorkloadData.map((role, index) => {
                            const totalStaff = staffMembers.length;
                            const percentage = totalStaff > 0 
                              ? ((role.workload / totalStaff) * 100).toFixed(1) 
                              : "0";
                              
                            return (
                              <tr key={index} className="border-b">
                                <td className="py-2 px-4">{role.name}</td>
                                <td className="text-right py-2 px-4">{role.workload}</td>
                                <td className="text-right py-2 px-4">{percentage}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {reportType === 'historical' && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Period</th>
                            <th className="text-right py-2 px-4">Team Efficiency</th>
                            <th className="text-right py-2 px-4">Customer Satisfaction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timePerformanceData.map((period, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2 px-4">{period.date}</td>
                              <td className="text-right py-2 px-4">{period.efficiency}%</td>
                              <td className="text-right py-2 px-4">{period.satisfaction}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Staff Overview</h3>
                      <p>Total staff: {staffMembers.length}</p>
                      <p>Team efficiency average: {teamAverage}%</p>
                      <p>Top performer: {topPerformer.name} ({topPerformer.efficiency}%)</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Role Distribution</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {roleWorkloadData.map((role, index) => (
                          <li key={index}>
                            {role.name}: {role.workload} staff ({((role.workload / staffMembers.length) * 100).toFixed(1)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Performance Insights</h3>
                      <p>
                        {teamAverage > 85 
                          ? "Team is performing exceptionally well with high efficiency scores." 
                          : teamAverage > 75 
                            ? "Team is performing adequately, with room for improvement."
                            : "Team efficiency is below target. Consider additional training and support."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
