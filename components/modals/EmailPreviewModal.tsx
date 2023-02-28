// React
import React, { FC, useState } from 'react';

// axios
import axios from 'axios';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

// react-pdf
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';

// Components
import LoadingModal from '../LoadingModal';
import InvoicePDFTemplate1 from '../../pdf/InvoicePDFTemplate1';

// Types
import { PdfData } from '../../types/customTypes';

const modalStyle = {
  margin: 'auto',
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
  emailFrom: string;
  emailTo: string;
  subject: string;
  message: string;
  pdfData: PdfData | null;
}

const EmailPreviewModal: FC<IProps> = ({ showModal, onClose, emailFrom, emailTo, subject, message, pdfData }) => {
  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  const reader = (file: any) => {
    return new Promise<string>((resolve, reject) => {
      const fileReader = new FileReader();
      // Making Typescript happy
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          resolve(fileReader.result);
        } else {
          resolve('something');
        }
      };
      fileReader.readAsDataURL(file);
    });
  };

  const readFile = async (file: any) => {
    const result = await reader(file);
    return result;
  };

  const renderPDFToString = async () => {
    if (pdfData) {
      let blobPdf = await pdf(<InvoicePDFTemplate1 data={pdfData} />).toBlob();
      // returns data:application/pdf;base64,---base64string
      const pdfBase64 = await readFile(blobPdf);
      // extract only the base 64 string;
      return pdfBase64.split(',')[1];
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const base64pdfData = await renderPDFToString();

    console.log({
      emailFrom,
      emailTo,
      subject,
      message,
      base64pdfData,
    });

    try {
      const { data } = await axios.post('/api/send-email', { emailFrom, emailTo, subject, message, base64pdfData });
      console.log(data);
    } catch (err) {
      console.log(err);
    }

    onClose();
  };

  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ overflow: 'auto' }}
    >
      <form onSubmit={sendEmail}>
        <Box sx={modalStyle}>
          <Typography variant="h4" align="center" sx={{ marginBottom: '2rem' }}>
            Email Preview
          </Typography>
          <Grid container spacing={4} sx={{ marginBottom: '30px' }}>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth value={emailFrom} disabled size="small" label="From" />
            </Grid>{' '}
            <Grid item xs={12} sm={4}>
              <TextField fullWidth value={emailTo} disabled size="small" label="To" />
            </Grid>{' '}
            <Grid item xs={12} sm={4}>
              <TextField fullWidth value={subject} disabled size="small" label="Subject" />
            </Grid>
            <Grid item sm={12}>
              <TextField value={message} disabled label="Message" fullWidth multiline minRows={8} maxRows={10} />
            </Grid>
          </Grid>

          <Box>
            {pdfData && (
              <PDFViewer style={{ height: 400, width: '100%' }}>
                <InvoicePDFTemplate1 data={pdfData} />
              </PDFViewer>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <Button variant="outlined" type="button" onClick={(e) => handleCancel(e)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Send Email
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};

export default EmailPreviewModal;
