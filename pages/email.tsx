// React
import { useState } from 'react';

// Next
import { NextPage } from 'next';

// Next Auth
import { useSession } from 'next-auth/react';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Components
import Navbar from '../components/Navbar';
import VerifyEmailModal from '../components/modals/VerifyEmailModal';

const Email: NextPage = () => {
  const { data: session, status } = useSession({ required: true });

  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);

  return (
    <div>
      <Navbar />
      <VerifyEmailModal showModal={showVerifyEmailModal} onClose={() => setShowVerifyEmailModal(false)} />
      <Container sx={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <Typography variant="h1" sx={{ fontSize: '2.5rem', marginRight: '2rem' }}>
            Verified Emails
          </Typography>
          <Button variant="contained" onClick={() => setShowVerifyEmailModal(true)}>
            Add Email
          </Button>
        </Box>

        <p>
          Looks like you currently don&lsquo; t have any verified email addresses associated with this account. Click
          add email to begin the verification process.
        </p>
      </Container>
    </div>
  );
};

export default Email;
