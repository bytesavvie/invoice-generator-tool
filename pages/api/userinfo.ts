import { db } from '../../firebase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { collection, getDoc, doc, addDoc, getDocs, query, where, deleteDoc, updateDoc } from 'firebase/firestore';

interface Error {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | Error>) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  if (req.method === 'PUT') {
    if (!req?.body?.userInfo) {
      res.status(400).json({ message: 'bad request' });
      return;
    }

    let userId = session.user.id;

    if (!userId) {
      res.status(404);
      return;
    }

    const docRef = doc(db, 'users', userId);
    try {
      await updateDoc(docRef, req.body.userInfo);
      res.status(204).json({ message: 'User information updated.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: `There was an error updating the student's information` });
    }
  }
}
