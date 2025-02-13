
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateReport, getReportStatus } from '../services/reportService';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ReportGenerateButtonProps {
  templateId: string;
  parameters?: Record<string, any>;
  onComplete?: (outputUrl: string) => void;
}

export function ReportGenerateButton({ 
  templateId, 
  parameters,
  onComplete 
}: ReportGenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const job = await generateReport({ templateId, parameters });
      
      // Poll for completion
      const checkStatus = async () => {
        const status = await getReportStatus(job.id);
        
        if (status.status === 'completed' && status.output_url) {
          setIsGenerating(false);
          toast.success('Report generated successfully');
          onComplete?.(status.output_url);
        } else if (status.status === 'failed') {
          setIsGenerating(false);
          toast.error(`Report generation failed: ${status.error_message}`);
        } else if (status.status === 'processing' || status.status === 'pending') {
          // Continue polling
          setTimeout(checkStatus, 2000);
        }
      };

      checkStatus();
    } catch (error) {
      setIsGenerating(false);
      toast.error('Failed to generate report');
      console.error('Report generation error:', error);
    }
  };

  return (
    <Button 
      onClick={handleGenerate} 
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Report'
      )}
    </Button>
  );
}
