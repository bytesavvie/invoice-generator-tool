// React
import React, { FC } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface IProps {
  showModal: boolean;
  onClose: () => void;
  selectedBase64PdfData: string;
}

const InvoiceQuickViewModal: FC<IProps> = ({ showModal, onClose, selectedBase64PdfData }) => {
  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
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
          Invoice
        </Typography>
        <Box>
          <iframe
            src={`data:application/pdf;base64,${selectedBase64PdfData}`}
            style={{ height: '75vh', width: '100%' }}
          ></iframe>
        </Box>
      </Box>
    </Modal>
  );
};

export default InvoiceQuickViewModal;
