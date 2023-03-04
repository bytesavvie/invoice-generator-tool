// Next
import type { NextApiRequest, NextApiResponse } from 'next';

// Next Auth
import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

// Firebase
import { db } from '../../firebase';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';

// Axios
import axios from 'axios';

// date-fns
import { format } from 'date-fns';

interface Error {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | Error>) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  if (req.method === 'GET') {
    let userId = session.user.id;

    if (!userId) {
      res.status(404);
      return;
    }

    const sentEmailsCollectionRef = collection(db, 'sentEmails');
    const sentEmailsQuery = query(sentEmailsCollectionRef, where('userId', '==', session.user.id));
    const sentEmailsData = await getDocs(sentEmailsQuery);

    const sentEmails = [] as any;

    sentEmailsData.docs.forEach((doc) => {
      let emailData = { ...doc.data(), id: doc.id } as any;
      if (emailData.userId) {
        delete emailData.expiresAt;
        delete emailData.userId;
      }

      if (emailData.sentAt) {
        emailData.sentAt = format(new Date(emailData.sentAt.seconds * 1000), 'MM/dd/yyyy');
      }
      sentEmails.push(emailData);
    });

    res.status(200).json(sentEmails);
    return;
  }

  if (req.method === 'POST') {
    if (
      !req?.body?.emailFrom ||
      !req.body.emailTo ||
      !req.body.message ||
      !req.body.subject ||
      !req.body.base64pdfData ||
      !req.body.pdfTitle ||
      !req.body.studentName
    ) {
      res.status(400).json({ message: 'bad request' });
      return;
    }

    let userId = session.user.id;

    if (!userId) {
      res.status(404);
      return;
    }

    const { emailFrom, emailTo, message, subject, base64pdfData, pdfTitle, studentName } = req.body;

    try {
      const { data, status } = await axios.post(
        `${process.env.AWS_API_URL}/send-email`,
        { emailFrom, emailTo, message, subject, base64pdfData, pdfTitle },
        {
          headers: { 'x-api-key': process.env.AWS_API_KEY || '' },
        },
      );

      const sentEmailsRef = collection(db, 'sentEmails');
      const expiredDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      const newEmailData = {
        emailTo,
        subject,
        studentName,
        base64pdfData,
        userId: session.user.id,
        sentAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(expiredDate),
      };
      let docRef = await addDoc(sentEmailsRef, newEmailData);
      console.log(docRef);

      res
        .status(status)
        .json({
          studentName,
          emailTo,
          base64pdfData,
          subject,
          sentAt: format(Date.now(), 'MM/dd/yyyy'),
          id: docRef.id,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Unable to send email.' });
    }
  }
}
