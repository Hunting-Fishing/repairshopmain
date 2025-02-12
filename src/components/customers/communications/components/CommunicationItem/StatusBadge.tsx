
interface StatusBadgeProps {
  status: 'delivered' | 'failed' | 'pending';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles = {
    delivered: 'text-green-600',
    failed: 'text-red-600',
    pending: 'text-yellow-600'
  };

  return (
    <div className={`text-sm ml-auto ${statusStyles[status]}`}>
      {status}
    </div>
  );
}
