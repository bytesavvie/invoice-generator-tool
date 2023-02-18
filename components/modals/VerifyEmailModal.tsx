// React
import React, { FC, useState } from 'react';

// axios
import axios from 'axios';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

// Components
import LoadingModal from '../LoadingModal';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface IProps {
  showModal: boolean;
  onClose: () => void;
}

const ConfirmModal: FC<IProps> = ({ showModal, onClose }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingText, setLoadingText] = useState('');

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setEmail('');
    onClose();
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingText('Sending verificaiton email');

    try {
      const { data } = await axios.post('/api/verified-emails', { email });
      console.log(data);
      setLoadingText('');
      onClose();
    } catch (err) {
      console.log(err);
      setLoadingText('');
      setErrorMessage('Unable to send Verificaiton Email.');
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        {loadingText && <LoadingModal text={loadingText} />}
        <form onSubmit={handleConfirm}>
          <Box sx={modalStyle}>
            <Typography variant="h4" align="center" sx={{ marginBottom: '2rem' }}>
              Add New Email
            </Typography>
            <Typography variant="body1" align="center" sx={{ marginBottom: '2rem' }}>
              Enter any email address below that you would like to send invoices from. A verification email will be sent
              to the address you enter. You will need to check your inbox and click on the verify link once you receive
              the email. Doing this will confirm you own the email address and complete the verification process,
              allowing you send emails directly from this application.
            </Typography>
            <TextField
              sx={{ marginBottom: '2rem' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              required
            />

            {errorMessage && (
              <Alert severity="error" sx={{ marginBottom: '1rem' }}>
                {errorMessage}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" type="button" onClick={(e) => handleCancel(e)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Send Verification Email
              </Button>
            </Box>
          </Box>
        </form>
      </>
    </Modal>
  );
};

export default ConfirmModal;
