// React
import { FC } from 'react';

// MUI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Types
import { SentEmail } from '../../types/customTypes';

interface IProps {
  sentEmails: SentEmail[];
}

const SentEmailsTable: FC<IProps> = ({ sentEmails }) => {
  return (
    <TableContainer component={Paper} sx={{ position: 'relative' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>To</TableCell>
            <TableCell>Sent</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sentEmails.map((email) => {
            return (
              <TableRow key={email.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{email.emailTo}</TableCell>
                <TableCell>{email.sentAt}</TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>
                  <a href={`data:application/pdf;base64,${email.base64pdfData}`}>View Invoice</a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SentEmailsTable;
