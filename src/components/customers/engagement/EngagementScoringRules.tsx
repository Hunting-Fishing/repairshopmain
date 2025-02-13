
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const scoringRuleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  interaction_type: z.string().min(1, "Interaction type is required"),
  points: z.number().min(0, "Points must be non-negative"),
  cooldown_hours: z.number().min(0, "Cooldown hours must be non-negative"),
  description: z.string().optional(),
});

type ScoringRule = z.infer<typeof scoringRuleSchema>;

export function EngagementScoringRules() {
  const queryClient = useQueryClient();
  const form = useForm<ScoringRule>({
    resolver: zodResolver(scoringRuleSchema),
    defaultValues: {
      points: 0,
      cooldown_hours: 0,
    },
  });

  const { data: rules, isLoading } = useQuery({
    queryKey: ["engagement-scoring-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagement_scoring_rules")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const createRule = useMutation({
    mutationFn: async (values: ScoringRule) => {
      const { error } = await supabase
        .from("engagement_scoring_rules")
        .insert([values]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engagement-scoring-rules"] });
      toast.success("Scoring rule created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create scoring rule: " + error.message);
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("engagement_scoring_rules")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["engagement-scoring-rules"] });
      toast.success("Scoring rule deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete scoring rule: " + error.message);
    },
  });

  const onSubmit = (values: ScoringRule) => {
    createRule.mutate(values);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Engagement Scoring Rules</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Scoring Rule</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rule Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter rule name" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interaction_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interaction Type</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., purchase, feedback" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cooldown_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooldown Hours</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional description" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">Create Rule</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Interaction Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Cooldown (Hours)</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules?.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.name}</TableCell>
                  <TableCell>{rule.interaction_type}</TableCell>
                  <TableCell>{rule.points}</TableCell>
                  <TableCell>{rule.cooldown_hours}</TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteRule.mutate(rule.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
