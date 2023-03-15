export const formatPDFTitle = (studentName: string, months: string[]) => {
  let formattedName = studentName.trim().split(' ').join('');
  let formattedDates = months.join('_');
  return `${formattedName}-${formattedDates}-invoice.pdf`;
};
