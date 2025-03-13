export const formatDateToStringForTitle = (dateString: string): string => {
  return dateString.replace(/\//g, '-');
  }