// Next
import type { NextApiRequest, NextApiResponse } from 'next';

// Next Auth
import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

// Axios
import axios from 'axios';

// firebase
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Types
import { VerifiedEmailAddressData } from '../../types/customTypes';

interface Error {
  message: string;
}

interface GetVerifiedEmailsResponse {
  statusCode: number;
  verificationStatuses: {
    [key: string]: {
      VerificationStatus: 'Pending' | 'Success';
    };
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | Error>) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  if (req.method === 'GET') {
    let verifiedEmailsCollectionRef = collection(db, 'verifiedEmails');
    const verifiedEmailsQuery = query(verifiedEmailsCollectionRef, where('userId', '==', session.user.id));
    const verifiedEmailsData = await getDocs(verifiedEmailsQuery);

    const verifiedEmails: any = [];

    verifiedEmailsData.docs.forEach((doc) => {
      let studentData = { ...doc.data(), id: doc.id } as any;
      if (studentData.userId) {
        delete studentData.userId;
      }
      verifiedEmails.push(studentData);
    });

    res.status(200).json(verifiedEmails);
    return;
  }

  if (req.method === 'POST') {
    if (!req?.body?.email) {
      res.status(400).json({ message: 'bad request' });
      return;
    }

    let userId = session.user.id;

    if (!userId) {
      res.status(404);
      return;
    }

    try {
      const { data, status } = await axios.post(
        `${process.env.AWS_API_URL}/verified-emails`,
        { email: req.body.email },
        {
          headers: { 'x-api-key': process.env.AWS_API_KEY || '' },
        },
      );
      const verifiedEmailsCollectionRef = collection(db, 'verifiedEmails');
      const docRef = await addDoc(verifiedEmailsCollectionRef, {
        emailAddress: req.body.email,
        verificationStatus: 'pending',
        userId: session.user.id,
      });
      res.status(status).json({ id: docRef.id, verificationStatus: 'pending', emailAddress: req.body.email });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Unable to verification email.' });
    }
  }

  if (req.method === 'PUT') {
    if (!req?.body?.emails) {
      res.status(400).json({ message: 'bad request' });
      return;
    }

    let userId = session.user.id;

    if (!userId) {
      res.status(404);
      return;
    }

    const emailArr: VerifiedEmailAddressData[] = req.body.emails;
    const emailsString = emailArr.map((email) => email.emailAddress).join(',');

    // const verifiedEmailsCollectionRef = collection(db, 'verifiedEmails');
    // const docRef = doc(db, "cities", "yftq9RGp4jWNSyBZ1D6L");
    // Success | Pending

    try {
      const { data } = await axios.get<GetVerifiedEmailsResponse>(
        `${process.env.AWS_API_URL}/verified-emails?email=${emailsString}`,
        {
          headers: { 'x-api-key': process.env.AWS_API_KEY || '' },
        },
      );

      for (let i = 0; i < emailArr.length; i++) {
        let email = emailArr[i];
        if (data.verificationStatuses[email.emailAddress]) {
          const docRef = doc(db, 'verifiedEmails', email.id);
          const newStatus =
            data.verificationStatuses[email.emailAddress].VerificationStatus === 'Success' ? 'verified' : 'pending';
          await updateDoc(docRef, { verificationStatus: newStatus });
          emailArr[i].verificationStatus = newStatus;
        }
      }

      res.status(data.statusCode).json(emailArr);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Unable to get verification statuses.' });
    }
  }

  if (req.method === 'DELETE') {
    console.log(req.body);
    res.status(200).json({ message: 'email removed' });
  }
}
