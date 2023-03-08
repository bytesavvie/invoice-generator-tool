// React
import React, { FC } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

// Types
import { SentEmail } from '../../types/customTypes';

const modalStyle = {
  margin: 'auto',
  position: 'relative',
  width: '100%',
  maxWidth: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

interface IProps {
  showModal: boolean;
  onClose: () => void;
  selectedEmail: SentEmail;
}

const InvoiceQuickViewModal: FC<IProps> = ({ showModal, onClose, selectedEmail }) => {
  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ overflow: 'auto' }}
    >
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon sx={{ height: 38, width: 38 }} />
        </IconButton>
        <Typography variant="h4" align="center" sx={{ marginBottom: '2rem' }}>
          Email - Sent {selectedEmail.sentAt}
        </Typography>
        <Grid container spacing={4} sx={{ marginBottom: '30px' }}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth value={selectedEmail.emailFrom} disabled size="small" label="From" />
          </Grid>{' '}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth value={selectedEmail.emailTo} disabled size="small" label="To" />
          </Grid>{' '}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth value={selectedEmail.subject} disabled size="small" label="Subject" />
          </Grid>
          <Grid item sm={12}>
            <TextField
              value={selectedEmail.message}
              disabled
              label="Message"
              fullWidth
              multiline
              minRows={8}
              maxRows={10}
            />
          </Grid>
        </Grid>

        <Box>
          <iframe
            src={`data:application/pdf;base64,${selectedEmail.base64pdfData}`}
            style={{ height: '75vh', width: '100%' }}
          ></iframe>
        </Box>
      </Box>
    </Modal>
  );
};

export default InvoiceQuickViewModal;
