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
    if (
      !req?.body?.emailFrom ||
      !req.body.emailTo ||
      !req.body.message ||
      !req.body.subject ||
      !req.body.base64pdfData ||
      !req.body.pdfTitle
    ) {
      res.status(400).json({ message: 'bad request' });
      return;
    }

    let userId = session.user.id;

    if (!userId) {
      res.status(404);
      return;
    }

    const { emailFrom, emailTo, message, subject, base64pdfData, pdfTitle } = req.body;

    try {
      const { data, status } = await axios.post(
        `${process.env.AWS_API_URL}/send-email`,
        { emailFrom, emailTo, message, subject, base64pdfData, pdfTitle },
        {
          headers: { 'x-api-key': process.env.AWS_API_KEY || '' },
        },
      );

      console.log('data', data, 'status', status);

      res.status(status).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Unable to send email.' });
    }
  }
}
