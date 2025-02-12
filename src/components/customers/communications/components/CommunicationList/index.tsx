
import { CommunicationItem } from "../CommunicationItem";
import { EmptyState } from "./EmptyState";
import type { Communication } from "../../types";

interface CommunicationListProps {
  communications: {
    messages: Communication[];
    sms: Communication[];
  };
}

export function CommunicationList({ communications }: CommunicationListProps) {
  const allCommunications = [...communications.messages, ...communications.sms].sort((a, b) => {
    const dateA = new Date(a.sent_at);
    const dateB = new Date(b.sent_at);
    return dateB.getTime() - dateA.getTime();
  });

  if (allCommunications.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4">
      {allCommunications.map((comm) => (
        <CommunicationItem key={comm.id} communication={comm} />
      ))}
    </div>
  );
}
