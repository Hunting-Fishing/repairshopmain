
export const formatStatTitle = (type: string): string => {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatStatValue = (type: string, value: number): string => {
  switch (type) {
    case 'revenue':
      return `$${value.toLocaleString()}`;
    case 'customers':
      return value.toLocaleString();
    case 'orders':
      return value.toLocaleString();
    case 'average_order':
      return `$${value.toLocaleString()}`;
    case 'satisfaction':
      return `${value.toFixed(1)}%`;
    default:
      return value.toLocaleString();
  }
};
