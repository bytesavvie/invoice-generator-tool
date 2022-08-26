import { db } from '../../firebase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { collection, getDoc, doc } from 'firebase/firestore';

type Data = {
  students: any;
};

interface Error {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  if (req.method === 'GET') {
    console.log('session', session);

    let usersRef = collection(db, 'users');
    const docRef = doc(usersRef, session.user.id);
    let result = (await getDoc(docRef)).data();

    // const result = await db.collection('users').doc(session.user.id).get();
    console.log('result', result);

    res.status(200).json({ students: [] });
    return;
  }
}
