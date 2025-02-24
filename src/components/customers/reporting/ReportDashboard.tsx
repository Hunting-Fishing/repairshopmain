
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const reportSchema = z.object({
  reportType: z.string().min(1, "Report type is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportDashboard() {
  const [generatingReport, setGeneratingReport] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: "",
      startDate: "",
      endDate: "",
    },
  });

  const { data: reportTypes, isLoading: loadingReportTypes } = useQuery({
    queryKey: ['reportTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_templates')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const onSubmit = async (data: ReportFormValues) => {
    setGeneratingReport(true);
    try {
      // Queue report generation
      const { error } = await supabase
        .from('report_processing_queue')
        .insert({
          report_type: data.reportType,
          parameters: {
            startDate: data.startDate,
            endDate: data.endDate,
          },
          status: 'pending'
        });

      if (error) throw error;
      toast.success("Report generation started");
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error(error.message || "Failed to generate report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const loadingContent = (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  );

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingReportTypes ? (
            loadingContent
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a report type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reportTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={generatingReport}
                >
                  {generatingReport ? (
                    <>
                      <LoadingSpinner className="mr-2" size="sm" />
                      Generating Report...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
