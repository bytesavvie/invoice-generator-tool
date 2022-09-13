export interface Student {
  id: string;
  name: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  lessonAmount: number;
}

export interface UserInfo {
  name: string;
  venmoUsername: string;
  paypalUsername: string;
  zelle: string;
}

export interface PdfData {
  yourName: string;
  venmoUsername: string;
  paypalUsername: string;
  zelle: string;
  parentName: string;
  parentEmail: string;
  studentName: string;
  lessonAmount: number;
  months: string[];
  lessonDates: string[];
  totalAmount: number;
}

export type Order = 'asc' | 'desc' | undefined;
