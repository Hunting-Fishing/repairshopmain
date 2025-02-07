
export function getAmzDate() {
  const date = new Date();
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

