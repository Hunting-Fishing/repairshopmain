
export const formatStatTitle = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatStatValue = (type: string, value: number): string => {
  switch (type) {
    case 'average_service_time':
      return `${value} hrs`;
    case 'customer_satisfaction':
      return `${value}/5`;
    default:
      return value.toString();
  }
};
