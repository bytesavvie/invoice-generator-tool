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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

// Types
import { Student } from '../types/customTypes';

const students: Student[] = [
  {
    name: 'Mark Mulligan',
    parentName: 'Carol Mulligan',
    parentEmail: 'carolmulligan@gmail.com',
    parentPhone: '817-660-6011',
    lessonAmount: 24,
  },
  {
    name: 'Another Student',
    parentName: 'Another Parent',
    parentEmail: 'parent@gmail.com',
    parentPhone: '897-343-9010',
    lessonAmount: 22,
  },
];

interface IProps {
  handleEditStudentClick: (student: Student) => void;
}

const StudentTable: FC<IProps> = ({ handleEditStudentClick }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Student Name</TableCell>
            <TableCell>Parent Name</TableCell>
            <TableCell>Parent Email</TableCell>
            <TableCell>Parent Phone</TableCell>
            <TableCell align="right">Lesson Amount</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {student.name}
              </TableCell>
              <TableCell>{student.parentName}</TableCell>
              <TableCell>{student.parentEmail}</TableCell>
              <TableCell>{student.parentPhone}</TableCell>
              <TableCell align="right">{student.lessonAmount}</TableCell>
              <TableCell align="right">
                <IconButton sx={{ marginRight: '20px' }}>
                  <EditIcon onClick={() => handleEditStudentClick(student)} />
                </IconButton>
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
