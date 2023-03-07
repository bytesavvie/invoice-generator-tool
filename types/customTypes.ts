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
  studentName: string;
}

/* Message: {
  "eventType":"Delivery",
  "mail": {
    "timestamp":"2023-03-07T14:42:28.430Z",
    "source":"mmulligan@evolontech.com",
    "sourceArn":"arn:aws:ses:us-east-1:131770882596:identity/mmulligan@evolontech.com",
    "sendingAccountId":"131770882596",
    "messageId":"01000186bc8611ce-ad82d13b-dbdc-4974-b247-3317f5b883ca-000000",
    "destination":["mark.mulligan.jr1@gmail.com"],
    "headersTruncated":false,
    "headers": [
      {"name":"Content-Type", "value":"multipart/mixed; boundary=\\"--_NmP-e1d455369f2821a8-Part_1\\""},
      {"name": "From","value":"mmulligan@evolontech.com"},
      {"name":"To","value":"mark.mulligan.jr1@gmail.com"},
      {"name":"Subject","value":"Lesson Invoice - March"},
      {"name":"Message-ID","value":"<c068f3a4-497b-34e4-8889-68694d4a3c14@evolontech.com>"},
      {"name":"Date","value":"Tue, 07 Mar 2023 14:42:27 +0000"},
      {"name":"MIME-Version","value":"1.0"}
    ],
    "commonHeaders":{
      "from":["mmulligan@evolontech.com"],
      "date":"Tue, 07 Mar 2023 14:42:27 +0000",
      "to":["mark.mulligan.jr1@gmail.com"],
      "messageId":"01000186bc8611ce-ad82d13b-dbdc-4974-b247-3317f5b883ca-000000",
      "subject":"Lesson Invoice - March"},
      "tags":{"ses:operation":["SendRawEmail"],
      "ses:configuration-set":["AlertSendEmail"],
      "ses:source-ip":["54.224.237.216"],
      "ses:from-domain":["evolontech.com"],
      "ses:caller-identity":["InvoiceGeneratorSendEmail2-role-2rmf167g"],
      "ses:outgoing-ip":["54.240.8.73"]}},
      "delivery":{"timestamp":"2023-03-07T14:42:29.324Z",
      "processingTimeMillis":894,
      "recipients":["mark.mulligan.jr1@gmail.com"],
      "smtpResponse":"250 2.0.0 OK  1678200149 h15-20020ac85e0f000000b003b86ab3a73dsi9793307qtx.775 - gsmtp",
      "reportingMTA":"a8-73.smtp-out.amazonses.com"
    }
  }
  \n',
*/
