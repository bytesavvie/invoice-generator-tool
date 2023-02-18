// Next
import type { NextApiRequest, NextApiResponse } from 'next';

// Next Auth
import { authOptions } from './auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth/next';

// Axios
import axios from 'axios';

interface Error {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any | Error>) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' });
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
      console.log(data);
      res.status(status).json({ message: `Verification email sent to ${req.body.email}` });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Unable to verification email.' });
    }
  }
}
