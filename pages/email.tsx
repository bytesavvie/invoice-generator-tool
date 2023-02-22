// React
import { useState, useEffect, useCallback } from 'react';

// Next
import { NextPage } from 'next';

// Next Auth
import { useSession } from 'next-auth/react';

// axios
import axios from 'axios';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Components
import Navbar from '../components/Navbar';
import VerifyEmailModal from '../components/modals/VerifyEmailModal';
import VerifiedEmailsTable from '../components/tables/VerifiedEmailsTable';
import LoadingModal from '../components/LoadingModal';

// Types
import { VerifiedEmailAddressData } from '../types/customTypes';

const Email: NextPage = () => {
  const { data: session, status } = useSession({ required: true });

  const [loadingText, setLoadingText] = useState('');
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [verifiedEmailList, setVerifiedEmailList] = useState<VerifiedEmailAddressData[]>([]);

  const handleGetVerifiedEmailList = useCallback(async () => {
    setLoadingText('Fetching Data...');
    try {
      const { data } = await axios.get<VerifiedEmailAddressData[]>('/api/verified-emails');
      setVerifiedEmailList(data);
      console.log('verifiedEmailList', data);
    } catch (err) {
      console.log(err);
    }
    setLoadingText('');
  }, []);

  useEffect(() => {
    handleGetVerifiedEmailList();
  }, [handleGetVerifiedEmailList]);

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

        {verifiedEmailList.length > 0 ? (
          <VerifiedEmailsTable verifiedEmailList={verifiedEmailList} setVerifiedEmailList={setVerifiedEmailList} />
        ) : (
          <p>
            Looks like you currently don&lsquo; t have any verified email addresses associated with this account. Click
            add email to begin the verification process.
          </p>
        )}
      </Container>
      {loadingText && <LoadingModal text={loadingText} />}
    </div>
  );
};

export default Email;
