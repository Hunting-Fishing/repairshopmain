
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { SkillAssessmentDialog } from "./SkillAssessmentDialog";
import { SkillAssessmentList } from "./components/SkillAssessmentList";
import { useSkillAssessments } from "./hooks/useSkillAssessments";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SkillAssessmentDashboardProps {
  profileId?: string;
}

export function SkillAssessmentDashboard({ profileId }: SkillAssessmentDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: assessments, isLoading: assessmentsLoading } = useSkillAssessments(profileId);

  // Reset states when dashboard mounts/unmounts
  useEffect(() => {
    return () => {
      setIsDialogOpen(false);
      setIsLoading(false);
    };
  }, []);

  const handleAddClick = async () => {
    try {
      setIsLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session?.user?.id) {
        throw new Error('Authentication required');
      }

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!userProfile?.organization_id) {
        throw new Error('Organization not found');
      }

      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error opening assessment dialog:', error);
      if (error instanceof Error) {
        if (error.message === 'Authentication required') {
          toast.error("Please sign in to add assessments");
        } else if (error.message === 'Organization not found') {
          toast.error("Organization settings not found");
        } else {
          toast.error("Failed to open assessment dialog: " + error.message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Skill Assessments</CardTitle>
        <Button 
          onClick={handleAddClick} 
          size="sm"
          disabled={isLoading || isDialogOpen}
          className="relative"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Assessment
        </Button>
      </CardHeader>
      <CardContent>
        <SkillAssessmentList 
          assessments={assessments} 
          isLoading={assessmentsLoading} 
        />
      </CardContent>
      <SkillAssessmentDialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            // Add a small delay when closing to ensure animations complete
            setTimeout(() => setIsDialogOpen(false), 100);
          } else {
            setIsDialogOpen(open);
          }
        }}
        profileId={profileId}
      />
    </Card>
  );
}
