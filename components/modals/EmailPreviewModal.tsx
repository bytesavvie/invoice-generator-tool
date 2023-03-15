// React
import React, { FC, useState, Dispatch, SetStateAction } from 'react';

// axios
import axios from 'axios';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

// react-pdf
import { PDFViewer, pdf } from '@react-pdf/renderer';

// Components
import InvoicePDFTemplate1 from '../../pdf/InvoicePDFTemplate1';
import LoadingModal from '../LoadingModal';

// utils
import { formatPDFTitle } from '../../utils/pdf';

// Types
import { PdfData, Student, SentEmail } from '../../types/customTypes';

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
  student: Student | null;
  sentEmails: SentEmail[];
  setSentEmails: Dispatch<SetStateAction<SentEmail[]>>;
}

const EmailPreviewModal: FC<IProps> = ({
  showModal,
  onClose,
  emailFrom,
  emailTo,
  subject,
  message,
  pdfData,
  student,
  sentEmails,
  setSentEmails,
}) => {
  const [loadingText, setLoadingText] = useState('');
  const [showEmailSentAlert, setShowEmailSentAlert] = useState(false);

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
    setLoadingText('Sending Email...');

    if (pdfData) {
      const base64pdfData = await renderPDFToString();
      const pdfTitle = formatPDFTitle(pdfData.studentName, pdfData.months);
      const studentName = student?.name || '';

      try {
        const { data } = await axios.post<SentEmail>('/api/send-email', {
          emailFrom,
          emailTo,
          subject,
          message,
          base64pdfData,
          pdfTitle,
          studentName,
        });

        setSentEmails((prevState) => [...prevState, data]);
        setShowEmailSentAlert(true);
      } catch (err) {
        console.log(err);
      }
    }

    setLoadingText('');
    onClose();
  };

  return (
    <>
      <Modal
        open={showModal}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflow: 'auto' }}
      >
        <Box component="form" onSubmit={sendEmail}>
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
        </Box>
      </Modal>
      {loadingText && <LoadingModal text={loadingText} />}
      <Snackbar open={showEmailSentAlert} autoHideDuration={3000} onClose={() => setShowEmailSentAlert(false)}>
        <Alert onClose={() => setShowEmailSentAlert(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          Email Sent!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EmailPreviewModal;
