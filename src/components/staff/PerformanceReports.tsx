
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

interface PerformanceReportsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PerformanceReports({ isOpen, onClose }: PerformanceReportsProps) {
  const [reportType, setReportType] = useState("efficiency");
  const [timeRange, setTimeRange] = useState("month");
  
  // Mock data for demonstration
  const efficiencyData = [
    { name: 'John D.', efficiency: 92, tasks: 45 },
    { name: 'Sarah M.', efficiency: 88, tasks: 38 },
    { name: 'Robert J.', efficiency: 85, tasks: 30 },
    { name: 'Lisa P.', efficiency: 82, tasks: 28 },
    { name: 'Mike T.', efficiency: 78, tasks: 25 },
    { name: 'Emma S.', efficiency: 76, tasks: 20 },
    { name: 'David C.', efficiency: 75, tasks: 18 },
    { name: 'Rachel K.', efficiency: 72, tasks: 15 },
  ];
  
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
  
  const roleWorkloadData = [
    { name: 'Technicians', workload: 45 },
    { name: 'Service Advisors', workload: 30 },
    { name: 'Managers', workload: 15 },
    { name: 'Administrative', workload: 10 },
  ];
  
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
                          <Tooltip formatter={(value) => [`${value}%`, 'Workload']} />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    {/* Replace CardTitle with a heading element to avoid the ReactElement type restriction */}
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
                    <div className="text-2xl font-bold">John D.</div>
                    <div className="text-sm text-muted-foreground">92% efficiency</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Team Average</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">82%</div>
                    <div className="text-sm text-muted-foreground">9% increase vs last period</div>
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
                  <div className="text-center text-muted-foreground py-8">
                    Tabular data view will be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    Summary report will be displayed here
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
