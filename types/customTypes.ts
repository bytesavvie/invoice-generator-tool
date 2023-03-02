export interface Student {
  id: string;
  name: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  lessonAmount: number;
}

export type TableHeaderId = keyof Student;

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

export interface AlertData {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

export interface VerifiedEmailAddressData {
  emailAddress: string;
  id: string;
  verificationStatus: 'pending' | 'verified';
}

export interface SentEmail {
  base64pdfData: string;
  emailTo: string;
  id: string;
  sentAt: string;
  subject: string;
}
