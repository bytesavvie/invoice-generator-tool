// React
import { FC, Dispatch, SetStateAction, useState } from 'react';

// axios
import axios from 'axios';

// MUI
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

// Icons
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

// Components
import ConfirmModal from '../ConfirmModal';

// Types
import { VerifiedEmailAddressData } from '../../types/customTypes';

interface IProps {
  verifiedEmailList: VerifiedEmailAddressData[];
  setVerifiedEmailList: Dispatch<SetStateAction<VerifiedEmailAddressData[]>>;
}

const VerifiedEmailsTable: FC<IProps> = ({ verifiedEmailList, setVerifiedEmailList }) => {
  const [loadingText, setLoadingText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<VerifiedEmailAddressData | null>(null);

  const removeVerifiedEmail = async () => {
    if (selectedEmail) {
      try {
        const { data } = await axios.delete('/api/verified-emails', {
          data: { email: selectedEmail },
        });
        setShowDeleteModal(false);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateVerificationStatuses = async () => {
    setLoadingText('Updating data...');
    try {
      const { data } = await axios.put<VerifiedEmailAddressData[]>('/api/verified-emails', {
        emails: verifiedEmailList,
      });
      setVerifiedEmailList(data);
    } catch (err) {
      console.log(err);
    }
    setLoadingText('');
  };

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
  return (
    <TableContainer component={Paper} sx={{ position: 'relative' }}>
      <ConfirmModal
        showModal={showDeleteModal}
        modalTitle="Remove Verified Email?"
        modalMessage={`Are you sure you want to remove "${selectedEmail?.emailAddress}".`}
        confirmText="Remove"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={removeVerifiedEmail}
      />

      {loadingText && (
        <Box
          sx={{
            zIndex: 10,
            background: 'rgba(10, 10, 10, 0.8)',
            height: '100%',
            width: '100%',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ mb: '1rem', fontSize: '16px' }}>{loadingText}</Typography>
            <CircularProgress />
          </Box>
        </Box>
      )}

      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>
              Verification Status{' '}
              <Button variant="outlined" size="small" sx={{ marginLeft: 2 }} onClick={updateVerificationStatuses}>
                Update
              </Button>
            </TableCell>
            <TableCell align="right"></TableCell>
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
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setSelectedEmail(email);
                      setShowDeleteModal(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VerifiedEmailsTable;
