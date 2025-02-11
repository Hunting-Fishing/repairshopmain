
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, ThumbsUp, ThumbsDown } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface CustomerFeedbackProps {
  customerId: string;
}

export function CustomerFeedback({ customerId }: CustomerFeedbackProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    type: "review",
    content: "",
    rating: 5,
  });

  const { data: feedback, refetch } = useQuery({
    queryKey: ["customer-feedback", customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_feedback")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmitFeedback = async () => {
    try {
      const { data: profile } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", profile.user?.id)
        .single();

      if (!userData?.organization_id) {
        throw new Error("Organization ID not found");
      }

      const { error } = await supabase
        .from("customer_feedback")
        .insert({
          customer_id: customerId,
          organization_id: userData.organization_id,
          type: newFeedback.type,
          content: newFeedback.content,
          rating: newFeedback.rating,
        });

      if (error) throw error;

      toast.success("Feedback recorded successfully");
      setIsDialogOpen(false);
      setNewFeedback({ type: "review", content: "", rating: 5 });
      refetch();
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Customer Feedback</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Add Feedback
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Customer Feedback</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={newFeedback.type}
                  onValueChange={(value) => 
                    setNewFeedback({ ...newFeedback, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Rating</Label>
                <Select
                  value={newFeedback.rating.toString()}
                  onValueChange={(value) => 
                    setNewFeedback({ ...newFeedback, rating: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <SelectItem key={rating} value={rating.toString()}>
                        {rating} Star{rating !== 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Content</Label>
                <Textarea
                  value={newFeedback.content}
                  onChange={(e) => 
                    setNewFeedback({ ...newFeedback, content: e.target.value })
                  }
                  placeholder="Enter feedback details..."
                  className="mt-1"
                />
              </div>

              <Button onClick={handleSubmitFeedback} className="w-full">
                Submit Feedback
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedback?.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-muted/50 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.rating >= 4 ? (
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium capitalize">{item.type}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(item.created_at)}
                </span>
              </div>
              <p className="text-sm">{item.content}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{item.rating} stars</span>
                {item.sentiment && (
                  <span className="capitalize">• {item.sentiment}</span>
                )}
              </div>
            </div>
          ))}
          {!feedback?.length && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No feedback recorded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
