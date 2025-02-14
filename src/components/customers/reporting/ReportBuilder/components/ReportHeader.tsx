
import { Button } from '@/components/ui/button';
import { ReportExport } from '../../ReportExport';
import { ReportScheduleDialog } from '../../ReportScheduleDialog';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface ReportHeaderProps {
  templateId?: string;
  previewData: any[];
  onSchedule: (schedule: any) => void;
}

export function ReportHeader({ templateId, previewData, onSchedule }: ReportHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Report Builder</CardTitle>
      <div className="flex items-center gap-2">
        <ReportExport templateId={templateId || ''} data={previewData} />
        <ReportScheduleDialog templateId={templateId || ''} onSchedule={onSchedule} />
      </div>
    </CardHeader>
  );
}
