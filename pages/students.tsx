// React
import { useState, useEffect, useContext, useCallback } from 'react';

// Next
import Head from 'next/head';
import type { NextPage } from 'next';

// Libraries
import axios from 'axios';
import { useSession } from 'next-auth/react';

// MUI
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

// Components
import Navbar from '../components/Navbar';
import StudentTable from '../components/StudentTable/StudentTable';
import StudentModal from '../components/StudentModal';
import ConfirmModal from '../components/ConfirmModal';
import LoadingModal from '../components/LoadingModal';

// Context
import { AppContext } from '../context';

// Types
import { Student, AlertData } from '../types/customTypes';

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession({ required: true });
  const {
    students,
    setStudents,
    hasFetchedStudents,
    setHasFetchedStudents,
    loadingText,
    setLoadingText,
    userInfo,
    setUserInfo,
    hasFetchedUserInfo,
    setHasFetchedUserInfo,
  } = useContext(AppContext);

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [originalUserInfo, setOriginalUserInfo] = useState(userInfo);
  const [unsavedChanges, setUnsavedChanges] = useState({
    name: false,
    venmoUsername: false,
    paypalUsername: false,
    zelle: false,
  });
  const [userAlertData, setUserAlertData] = useState<AlertData>({ message: '', severity: 'success' });
  const [studentAlertData, setStudentAlertData] = useState<AlertData>({ message: '', severity: 'success' });

  const handleUpdateUserInfo = async () => {
    setLoadingText('Updating User Data...');
    try {
      const { name, venmoUsername, paypalUsername, zelle } = userInfo;
      await axios.put('/api/userinfo', { userInfo: { name, venmoUsername, paypalUsername, zelle } });
      setOriginalUserInfo({ name, venmoUsername, paypalUsername, zelle });
      setUserAlertData({ message: 'Infomration updated.', severity: 'success' });
      setTimeout(() => {
        setUserAlertData({ message: '', severity: 'success' });
      }, 2000);
    } catch (err) {
      console.log(err);
      setStudentAlertData({ message: 'Unable to update information. Please try again later.', severity: 'error' });
    }

    setLoadingText('');
  };

  const handleEditStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);
  };

  const handleAddStudentClick = () => {
    setSelectedStudent(null);
    setShowStudentModal(true);
  };

  const handleDeleteStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setShowConfirmModal(true);
  };

  const handleStudentModalClose = () => {
    setShowStudentModal(false);
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) {
      return;
    }

    setLoadingText('Deleting Student...');

    try {
      await axios.delete(`/api/students?id=${selectedStudent.id}`);
      const updatedStudents: Student[] = [];
      students.forEach((student) => {
        if (student.id !== selectedStudent.id) {
          updatedStudents.push(student);
        }
      });

      setStudents(updatedStudents);
      setStudentAlertData({ message: 'Student deleted.', severity: 'success' });
      setTimeout(() => {
        setStudentAlertData({ message: '', severity: 'success' });
      }, 2000);
    } catch (err) {
      console.log(err);
      setStudentAlertData({
        message: 'An error occured while trying to delete the student. Please try again.',
        severity: 'error',
      });
    }

    setLoadingText('');
    setShowConfirmModal(false);
  };

  const handleGetStudents = useCallback(async () => {
    setLoadingText('Fetching Data...');
    try {
      const { data } = await axios.get<Student[]>('/api/students');
      setStudents(data);
    } catch (err) {
      console.log(err);
    }
    setLoadingText('');
  }, [setStudents, setLoadingText]);

  useEffect(() => {
    setUnsavedChanges({
      name: userInfo.name !== originalUserInfo.name,
      venmoUsername: userInfo.venmoUsername !== originalUserInfo.venmoUsername,
      paypalUsername: userInfo.paypalUsername !== originalUserInfo.paypalUsername,
      zelle: userInfo.zelle !== originalUserInfo.zelle,
    });
  }, [userInfo, originalUserInfo]);

  useEffect(() => {
    if (session?.user?.name && !hasFetchedUserInfo) {
      setHasFetchedUserInfo(true);

      const newUserInfo = {
        name: session.user.name,
        venmoUsername: session.user.venmoUsername || '',
        paypalUsername: session.user.paypalUsername || '',
        zelle: session.user.zelle || '',
      };

      setUserInfo(newUserInfo);
      setOriginalUserInfo(newUserInfo);
    }
  }, [session, setUserInfo, hasFetchedUserInfo, setHasFetchedUserInfo]);

  useEffect(() => {
    if (!hasFetchedStudents) {
      handleGetStudents();
      setHasFetchedStudents(true);
    }
  }, [handleGetStudents, hasFetchedStudents, setHasFetchedStudents]);

  useEffect(() => {
    if (studentSearch) {
      const newStudentsList = students.filter((student) => {
        let searchFormatted = studentSearch.toLowerCase();
        const studentValues: (string | number)[] = Object.values(student);
        let result = false;

        for (let i = 0; i < studentValues.length; i++) {
          const studentValue = studentValues[i];

          if (typeof studentValue === 'number') {
            result = studentValue.toString().includes(searchFormatted);
          } else {
            result = studentValue.toLowerCase().includes(searchFormatted);
          }

          if (result) break;
        }

        return result;
      });

      setFilteredStudents(newStudentsList);
    } else {
      setFilteredStudents([...students]);
    }
  }, [students, studentSearch]);

  if (status === 'loading') {
    return <LoadingModal text="Loading..." />;
  }

  return (
    <div>
      <Head>
        <title>Invoice Generator - Student Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Container sx={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <Typography variant="h1" sx={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
          Dashboard
        </Typography>

        <Box component="section" sx={{ marginBottom: '2rem' }}>
          <Typography variant="h2" sx={{ fontSize: '2rem', marginBottom: '2rem' }}>
            Your Info
          </Typography>
          {userAlertData.message && (
            <Alert
              onClose={() => setUserAlertData({ message: '', severity: 'success' })}
              severity={userAlertData.severity}
              variant="filled"
            >
              {userAlertData.message}
            </Alert>
          )}
          <Paper component="section" sx={{ padding: '1.2rem' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  helperText={unsavedChanges.name ? 'Unsaved Changes' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={userInfo.venmoUsername}
                  onChange={(e) => setUserInfo({ ...userInfo, venmoUsername: e.target.value })}
                  id="outlined-basic"
                  label="Venmo Username (No @)"
                  variant="outlined"
                  fullWidth
                  size="small"
                  helperText={unsavedChanges.venmoUsername ? 'Unsaved Changes' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={userInfo.paypalUsername}
                  onChange={(e) => setUserInfo({ ...userInfo, paypalUsername: e.target.value })}
                  id="outlined-basic"
                  label="Paypal Username"
                  variant="outlined"
                  fullWidth
                  size="small"
                  helperText={unsavedChanges.paypalUsername ? 'Unsaved Changes' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={userInfo.zelle}
                  onChange={(e) => setUserInfo({ ...userInfo, zelle: e.target.value })}
                  id="outlined-basic"
                  label="Zelle (Phone Or Email)"
                  variant="outlined"
                  fullWidth
                  size="small"
                  helperText={unsavedChanges.zelle ? 'Unsaved Changes' : ''}
                />
              </Grid>
            </Grid>
            {unsavedChanges.name ||
            unsavedChanges.venmoUsername ||
            unsavedChanges.paypalUsername ||
            unsavedChanges.zelle ? (
              <Box sx={{ textAlign: 'center', marginTop: '1rem' }}>
                <Button variant="contained" onClick={() => handleUpdateUserInfo()}>
                  Save
                </Button>
              </Box>
            ) : null}
          </Paper>
        </Box>

        <Box component="section">
          <Typography variant="h2" sx={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Students
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
            }}
          >
            <TextField
              sx={{ marginBottom: '1.5rem' }}
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
            />
            <Button variant="contained" onClick={() => handleAddStudentClick()} sx={{ marginBottom: '1.5rem' }}>
              Add Student
            </Button>
          </Box>

          {studentAlertData.message && (
            <Alert
              onClose={() => setStudentAlertData({ message: '', severity: 'success' })}
              severity={studentAlertData.severity}
              variant="filled"
            >
              {studentAlertData.message}
            </Alert>
          )}

          <StudentModal
            onClose={handleStudentModalClose}
            showModal={showStudentModal}
            selectedStudent={selectedStudent}
            setAlertData={setStudentAlertData}
          />
          <StudentTable
            handleEditStudentClick={handleEditStudentClick}
            studentData={filteredStudents}
            handleDeleteStudentClick={handleDeleteStudentClick}
          />
          <ConfirmModal
            modalTitle="Delete Student?"
            modalMessage={`Are you sure you want to the delete the student ${selectedStudent?.name || ''}?`}
            showModal={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            confirmText="Delete Student"
            onConfirm={() => handleDeleteStudent()}
          />
        </Box>
      </Container>
      {loadingText && <LoadingModal text={loadingText} />}
    </div>
  );
};

export default Dashboard;
