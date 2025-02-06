
export function getFileType(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop();
  
  if (/^(jpg|jpeg|png|gif|webp)$/i.test(extension || '')) {
    return 'image';
  }
  
  if (extension === 'pdf') {
    return 'pdf';
  }
  
  if (['xlsx', 'xls'].includes(extension || '')) {
    return 'excel';
  }
  
  return 'other';
}

