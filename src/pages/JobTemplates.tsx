
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, FileText, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobTemplates, useTemplateCategories } from "@/hooks/use-job-templates";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JobTemplates() {
  const { data: templates = [], isLoading, error, refetch } = useJobTemplates();
  const { data: categories = [], isLoading: loadingCategories } = useTemplateCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      template.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = 
      difficultyFilter === "all" || 
      template.difficulty_level?.toString() === difficultyFilter;
    
    const matchesCategory = 
      categoryFilter === "all" || 
      template.category_id === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Group templates by category
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const categoryName = categories.find(c => c.id === template.category_id)?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  const getDifficultyColor = (level?: number) => {
    if (!level) return "bg-gray-100 text-gray-800";
    const colors = {
      1: "bg-green-100 text-green-800",
      2: "bg-blue-100 text-blue-800",
      3: "bg-yellow-100 text-yellow-800",
      4: "bg-orange-100 text-orange-800",
      5: "bg-red-100 text-red-800"
    };
    return colors[level as keyof typeof colors] || colors[3];
  };

  if (error) {
    return (
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Job Templates</h1>
                  <p className="text-muted-foreground">
                    Manage job templates for common repair tasks
                  </p>
                </div>
              </div>
            </div>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message || 'Failed to load job templates'}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Job Templates</h1>
                <p className="text-muted-foreground">
                  Manage job templates for common repair tasks
                </p>
              </div>
            </div>
            <Button className="hidden sm:flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Template</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Difficulty" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="1">Level 1 (Easiest)</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                  <SelectItem value="5">Level 5 (Hardest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button className="sm:hidden w-full flex items-center gap-2 justify-center">
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </Button>

          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-8">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-[220px] w-full" />
                  ))}
                </div>
              ) : Object.keys(groupedTemplates).length === 0 ? (
                <Alert>
                  <AlertTitle>No templates found</AlertTitle>
                  <AlertDescription>
                    {searchQuery || difficultyFilter !== "all" || categoryFilter !== "all" 
                      ? "No templates match your current filters. Try adjusting your search criteria."
                      : "No job templates are currently available. Click 'New Template' to add one."}
                  </AlertDescription>
                </Alert>
              ) : (
                Object.entries(groupedTemplates).map(([category, items]) => (
                  <div key={category} className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((template) => (
                        <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              {template.difficulty_level && (
                                <Badge className={getDifficultyColor(template.difficulty_level)}>
                                  Level {template.difficulty_level}
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {template.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {template.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                              {template.estimated_duration_range && (
                                <Badge variant="outline">
                                  {template.estimated_duration_range.min}-{template.estimated_duration_range.max} min
                                </Badge>
                              )}
                              {template.required_tools && template.required_tools.length > 0 && (
                                <Badge variant="outline">
                                  {template.required_tools.length} tools
                                </Badge>
                              )}
                              {template.usage_stats?.success_rate && (
                                <Badge variant="secondary">
                                  {Math.round(template.usage_stats.success_rate)}% success
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : Object.keys(groupedTemplates).length === 0 ? (
                <Alert>
                  <AlertTitle>No templates found</AlertTitle>
                  <AlertDescription>
                    {searchQuery || difficultyFilter !== "all" || categoryFilter !== "all" 
                      ? "No templates match your current filters. Try adjusting your search criteria."
                      : "No job templates are currently available. Click 'New Template' to add one."}
                  </AlertDescription>
                </Alert>
              ) : (
                Object.entries(groupedTemplates).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight">{category}</h2>
                    <div className="divide-y rounded-md border">
                      {items.map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{template.name}</h3>
                              {template.difficulty_level && (
                                <Badge className={getDifficultyColor(template.difficulty_level)}>
                                  Level {template.difficulty_level}
                                </Badge>
                              )}
                            </div>
                            {template.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {template.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                            {template.estimated_duration_range && (
                              <Badge variant="outline">
                                {template.estimated_duration_range.min}-{template.estimated_duration_range.max} min
                              </Badge>
                            )}
                            {template.usage_stats?.success_rate && (
                              <Badge variant="secondary">
                                {Math.round(template.usage_stats.success_rate)}% success
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
