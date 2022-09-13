// React
import { FC, useState, useEffect } from 'react';

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
import Box from '@mui/material/Box';

// Components
import TableHeaderSortIcon from './CustomSortIcon';

// Types
import { Student, Order } from '../types/customTypes';

interface IProps {
  handleEditStudentClick: (student: Student) => void;
  handleDeleteStudentClick: (student: Student) => void;
  studentData: Student[];
}

const StudentTable: FC<IProps> = ({ handleEditStudentClick, handleDeleteStudentClick, studentData }) => {
  const [order, setOrder] = useState<Order>(undefined);
  const [orderBy, setOrderBy] = useState('');

  const handleTableHeaderClick = (selectedColumn: string) => {
    if (orderBy === selectedColumn) {
      if (order === 'asc') setOrder('desc');
      if (order === 'desc') setOrder(undefined);
      if (!order) setOrder('asc');
    } else {
      setOrder('asc');
      setOrderBy(selectedColumn);
    }
  };

  useEffect(() => {
    console.log(order);
    console.log(orderBy);
  }, [order, orderBy]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 670, overflow: 'auto' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleTableHeaderClick('name')}>
              <TableHeaderSortIcon columnHeaderKey="name" columnName="Student Name" order={order} orderBy={orderBy} />
            </TableCell>
            <TableCell onClick={() => handleTableHeaderClick('parentName')}>Parent Name</TableCell>
            <TableCell>Parent Email</TableCell>
            <TableCell>Parent Phone</TableCell>
            <TableCell align="right">Lesson Amount</TableCell>
            <TableCell align="right" sx={{ minWidth: '130px' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentData.map((student) => (
            <TableRow key={student.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {student.name}
              </TableCell>
              <TableCell>{student.parentName}</TableCell>
              <TableCell>{student.parentEmail}</TableCell>
              <TableCell>{student.parentPhone}</TableCell>
              <TableCell align="right">{student.lessonAmount}</TableCell>
              <TableCell align="right">
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    maxWidth: 100,
                    marginRight: 0,
                    marginLeft: 'auto',
                  }}
                >
                  <IconButton onClick={() => handleEditStudentClick(student)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteStudentClick(student)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;
