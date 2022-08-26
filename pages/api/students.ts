import { db } from '../../firebase';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';
import { collection, getDoc, doc, addDoc, getDocs, query, where } from 'firebase/firestore';

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
    let studentCollectionRef = collection(db, 'students');
    const studentsQuery = query(studentCollectionRef, where('userId', '==', session.user.id));
    const studentsData = await getDocs(studentsQuery);

    const students = [] as any;

    studentsData.docs.forEach((doc) => {
      let studentData = { ...doc.data(), id: doc.id } as any;
      if (studentData.userId) {
        delete studentData.userId;
      }
      students.push(studentData);
    });

    res.status(200).json(students);
    return;
  }

  if (req.method === 'POST') {
    if (!req.body?.student) {
      res.status(400).json({ message: 'bad request' });
      return;
    }

    const studentInfo = req.body.student;

    try {
      const studentCollectionRef = collection(db, 'students');
      let docRef = await addDoc(studentCollectionRef, { ...studentInfo, userId: session.user.id });
      res.status(201).json({ ...studentInfo, id: docRef.id });
      return;
    } catch (err) {
      res.status(500).json({ message: 'There was an error saving the student.' });
      return;
    }
  }
}
