export interface Student {
  id: string;
  name: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  lessonAmount: number;
}

export interface PdfData {
  yourName: string;
  parentName: string;
  parentEmail: string;
  studentName: string;
  lessonAmount: number;
  months: string[];
  lessonDates: string[];
  totalAmount: number;
}
