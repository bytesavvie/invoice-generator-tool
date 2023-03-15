// React
import { FC, useState } from 'react';

// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

// Components
import InvoiceQuickViewModal from '../modals/InvoiceQuickViewModal';

// Types
import { SentEmail } from '../../types/customTypes';

interface IProps {
  sentEmails: SentEmail[];
}

const SentEmailsTable: FC<IProps> = ({ sentEmails }) => {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<SentEmail>({
    base64pdfData: '',
    emailTo: '',
    emailFrom: '',
    id: '',
    sentAt: '',
    message: '',
    subject: '',
    studentName: '',
  });

  const handleViewEmailClick = (email: SentEmail) => {
    setSelectedEmail(email);
    setShowPdfModal(true);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ position: 'relative', maxHeight: 450 }}>
        <Table sx={{ minWidth: 670, overflow: 'auto' }} stickyHeader aria-label="simple table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Sent</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sentEmails.map((email) => {
              return (
                <TableRow key={email.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{email.studentName}</TableCell>
                  <TableCell>{email.emailTo}</TableCell>
                  <TableCell>{email.sentAt}</TableCell>
                  <TableCell>{email.subject}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleViewEmailClick(email)}>
                      View Contents
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <InvoiceQuickViewModal
        showModal={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        selectedEmail={selectedEmail}
      />
    </>
  );
};

export default SentEmailsTable;
