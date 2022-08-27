// React
import React, { FC } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

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
  modalTitle: string;
  modalMessage: string;
  showModal: boolean;
  onClose: () => void;
  confirmText: string;
  onConfirm: () => void;
}

const ConfirmModal: FC<IProps> = ({ modalTitle, modalMessage, showModal, onClose, confirmText, onConfirm }) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form onSubmit={handleConfirm}>
        <Box sx={modalStyle}>
          <Typography variant="h4" align="center" sx={{ marginBottom: '2rem' }}>
            {modalTitle}
          </Typography>
          <Typography variant="body1" align="center" sx={{ marginBottom: '2rem' }}>
            {modalMessage}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" type="button" onClick={(e) => handleCancel(e)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              {confirmText}
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};

export default ConfirmModal;
