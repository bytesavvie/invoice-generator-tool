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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';

// Components
import Navbar from '../components/Navbar';
import VerifyEmailModal from '../components/modals/VerifyEmailModal';
import LoadingModal from '../components/LoadingModal';

// Types
import { VerifiedEmailAddressData } from '../types/customTypes';

const Email: NextPage = () => {
  const { data: session, status } = useSession({ required: true });

  const [loadingText, setLoadingText] = useState('');
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [verifiedEmailList, setVerifiedEmailList] = useState<VerifiedEmailAddressData[]>([]);

  const renderVerificationStatus = (status: 'verified' | 'pending') => {
    if (status === 'verified') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#388e3c' }}>
          {status} <CheckIcon sx={{ marginLeft: '5px' }} />
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
        {status} <AccessTimeIcon sx={{ marginLeft: '5px' }} />
      </Box>
    );
  };

  const updateVerificationStatuses = async () => {
    try {
      const { data } = await axios.put<VerifiedEmailAddressData[]>('/api/verified-emails', {
        emails: verifiedEmailList,
      });
      setVerifiedEmailList(data);
    } catch (err) {
      console.log(err);
    }
  };

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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>
                    Verification Status{' '}
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ marginLeft: 2 }}
                      onClick={updateVerificationStatuses}
                    >
                      Update
                    </Button>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {verifiedEmailList.map((email) => {
                  return (
                    <TableRow key={email.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {email.emailAddress}
                      </TableCell>

                      <TableCell>{renderVerificationStatus(email.verificationStatus)}</TableCell>

                      <TableCell>
                        <Button variant="outlined" size="small">
                          Resend Verification Email
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
