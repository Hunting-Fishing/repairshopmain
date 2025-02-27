
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Bell, ShieldAlert, Info, CheckCircle, Clock, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data for the alerts
const alerts = [
  {
    id: "1",
    title: "Critical Stock Level: Brake Fluid",
    description: "Stock level has fallen below the critical threshold of 10 units",
    type: "inventory",
    severity: "critical",
    timestamp: "2025-02-27T08:15:00.000Z",
    status: "active"
  },
  {
    id: "2",
    title: "System Performance Warning",
    description: "High CPU usage detected: 87% - This may affect system responsiveness",
    type: "system",
    severity: "warning",
    timestamp: "2025-02-27T07:45:00.000Z",
    status: "active"
  },
  {
    id: "3",
    title: "Database Backup Completed",
    description: "Scheduled database backup completed successfully",
    type: "database",
    severity: "info",
    timestamp: "2025-02-27T06:30:00.000Z",
    status: "resolved"
  },
  {
    id: "4",
    title: "Failed Login Attempts",
    description: "Multiple failed login attempts detected for user account: admin@repairshop.com",
    type: "security",
    severity: "high",
    timestamp: "2025-02-27T05:12:00.000Z",
    status: "active"
  },
  {
    id: "5",
    title: "API Integration Error",
    description: "Connection to payment gateway timed out after 30 seconds",
    type: "integration",
    severity: "high",
    timestamp: "2025-02-27T04:38:00.000Z",
    status: "active"
  },
  {
    id: "6",
    title: "Error Rate Threshold Exceeded",
    description: "Error rate reached 8.5% in the last hour (threshold: 5%)",
    type: "system",
    severity: "critical",
    timestamp: "2025-02-27T03:55:00.000Z",
    status: "acknowledged"
  },
  {
    id: "7",
    title: "Low Stock Warning: Air Filter",
    description: "Stock level is approaching the minimum threshold (15 units remaining)",
    type: "inventory",
    severity: "warning",
    timestamp: "2025-02-27T02:10:00.000Z",
    status: "active"
  },
  {
    id: "8",
    title: "Scheduled Maintenance Completed",
    description: "System maintenance completed successfully - No issues found",
    type: "system",
    severity: "info",
    timestamp: "2025-02-26T23:45:00.000Z",
    status: "resolved"
  }
];

const metrics = [
  { title: "Active Alerts", value: "5", change: "+2", changeType: "negative" },
  { title: "Critical Issues", value: "2", change: "+1", changeType: "negative" },
  { title: "Resolved Today", value: "3", change: "+3", changeType: "positive" },
  { title: "System Health", value: "92%", change: "-3%", changeType: "negative" }
];

export default function SystemAlerts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [currentTab, setCurrentTab] = useState("all");
  
  // Filter alerts based on search, status, severity and tab
  const filteredAlerts = alerts.filter(alert => {
    // Text search
    const matchesSearch = 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    
    // Severity filter
    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter;
    
    // Tab filter
    const matchesTab = currentTab === "all" || alert.type === currentTab;
    
    return matchesSearch && matchesStatus && matchesSeverity && matchesTab;
  });
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge variant="destructive" className="bg-red-500">High</Badge>;
      case "warning":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Warning</Badge>;
      case "info":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Info</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="border-red-500 text-red-500 bg-red-50 dark:bg-red-950">Active</Badge>;
      case "acknowledged":
        return <Badge variant="outline" className="border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950">Acknowledged</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500 text-green-500 bg-green-50 dark:bg-green-950">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "system":
        return <ShieldAlert className="h-4 w-4 text-orange-500" />;
      case "security":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case "inventory":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "database":
        return <Info className="h-4 w-4 text-green-500" />;
      case "integration":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">System Alerts</h1>
                <p className="text-muted-foreground">
                  Monitor and manage system notifications and warnings
                </p>
              </div>
            </div>
          </div>

          {/* Metrics cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium">{metric.title}</p>
                    {metric.title === "System Health" ? (
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`ml-2 text-xs ${
                      metric.changeType === 'positive' 
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      {metric.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alert Management</CardTitle>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Configure Notifications</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" onValueChange={setCurrentTab} className="space-y-4">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-x-4 md:space-y-0">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="system">System</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    <TabsTrigger value="integration">Integrations</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                    <div className="relative w-full md:w-60">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search alerts..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Select defaultValue="all" onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[130px]">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="acknowledged">Acknowledged</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all" onValueChange={setSeverityFilter}>
                        <SelectTrigger className="w-full md:w-[130px]">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Severity" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Severity</TableHead>
                          <TableHead>Alert</TableHead>
                          <TableHead className="hidden md:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Time</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No alerts found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAlerts.map((alert) => (
                            <TableRow key={alert.id}>
                              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                              <TableCell>
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                                  <div>
                                    <div className="font-medium">{alert.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{alert.description}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell capitalize">{alert.type}</TableCell>
                              <TableCell className="hidden md:table-cell">{getStatusBadge(alert.status)}</TableCell>
                              <TableCell className="hidden md:table-cell">{formatDate(alert.timestamp)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  {alert.status === "resolved" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Info className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                {/* Duplicate content for the other tabs - using same content as "all" tab but filtered by tab value */}
                <TabsContent value="system" className="space-y-4">
                  {/* Same content but only system alerts */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Severity</TableHead>
                          <TableHead>Alert</TableHead>
                          <TableHead className="hidden md:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Time</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No system alerts found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAlerts.map((alert) => (
                            <TableRow key={alert.id}>
                              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                              <TableCell>
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                                  <div>
                                    <div className="font-medium">{alert.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{alert.description}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell capitalize">{alert.type}</TableCell>
                              <TableCell className="hidden md:table-cell">{getStatusBadge(alert.status)}</TableCell>
                              <TableCell className="hidden md:table-cell">{formatDate(alert.timestamp)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  {alert.status === "resolved" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Info className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* We define the rest of the tab content similarly for the remaining tabs */}
                <TabsContent value="security" className="space-y-4">
                  {/* Security alerts */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Severity</TableHead>
                          <TableHead>Alert</TableHead>
                          <TableHead className="hidden md:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Time</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No security alerts found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAlerts.map((alert) => (
                            <TableRow key={alert.id}>
                              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                              <TableCell>
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                                  <div>
                                    <div className="font-medium">{alert.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{alert.description}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell capitalize">{alert.type}</TableCell>
                              <TableCell className="hidden md:table-cell">{getStatusBadge(alert.status)}</TableCell>
                              <TableCell className="hidden md:table-cell">{formatDate(alert.timestamp)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  {alert.status === "resolved" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Info className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                  {/* Inventory alerts */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Severity</TableHead>
                          <TableHead>Alert</TableHead>
                          <TableHead className="hidden md:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Time</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No inventory alerts found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAlerts.map((alert) => (
                            <TableRow key={alert.id}>
                              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                              <TableCell>
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                                  <div>
                                    <div className="font-medium">{alert.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{alert.description}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell capitalize">{alert.type}</TableCell>
                              <TableCell className="hidden md:table-cell">{getStatusBadge(alert.status)}</TableCell>
                              <TableCell className="hidden md:table-cell">{formatDate(alert.timestamp)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  {alert.status === "resolved" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Info className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="integration" className="space-y-4">
                  {/* Integration alerts */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Severity</TableHead>
                          <TableHead>Alert</TableHead>
                          <TableHead className="hidden md:table-cell">Type</TableHead>
                          <TableHead className="hidden md:table-cell">Status</TableHead>
                          <TableHead className="hidden md:table-cell">Time</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAlerts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No integration alerts found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAlerts.map((alert) => (
                            <TableRow key={alert.id}>
                              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                              <TableCell>
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">{getTypeIcon(alert.type)}</div>
                                  <div>
                                    <div className="font-medium">{alert.title}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{alert.description}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell capitalize">{alert.type}</TableCell>
                              <TableCell className="hidden md:table-cell">{getStatusBadge(alert.status)}</TableCell>
                              <TableCell className="hidden md:table-cell">{formatDate(alert.timestamp)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  {alert.status === "resolved" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Info className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
