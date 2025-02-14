
import { CardHeader, CardTitle } from '@/components/ui/card';
import { ReportExport } from '../../ReportExport';
import { ReportScheduleDialog } from '../../ReportScheduleDialog';

interface ReportHeaderProps {
  templateId: string | undefined;
  previewData: any[];
  onSchedule: (schedule: any) => Promise<void>;
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
