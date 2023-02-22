// React
import { useState, useEffect, useCallback, useContext } from 'react';

// Next
import { NextPage } from 'next';

// Next Auth
import { useSession } from 'next-auth/react';

// axios
import axios from 'axios';

// MUI
import { debounce } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// React Multi Date Picker
import DatePicker from 'react-multi-date-picker';

// Components
import Navbar from '../components/Navbar';
import VerifyEmailModal from '../components/modals/VerifyEmailModal';
import VerifiedEmailsTable from '../components/tables/VerifiedEmailsTable';
import LoadingModal from '../components/LoadingModal';

// Context
import { AppContext } from '../context';

// Types
import { VerifiedEmailAddressData, Student } from '../types/customTypes';

const Email: NextPage = () => {
  const { data: session, status } = useSession({ required: true });
  const {
    students,
    setStudents,
    hasFetchedStudents,
    setHasFetchedStudents,
    userInfo,
    setUserInfo,
    hasFetchedUserInfo,
    setHasFetchedUserInfo,
  } = useContext(AppContext);

  const [lessonDates, setLessonDates] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [yourName, setYourName] = useState('');
  const [debouncedName, setDebouncedName] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [verifiedEmailList, setVerifiedEmailList] = useState<VerifiedEmailAddressData[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateYourName = useCallback(
    debounce((value) => setDebouncedName(value), 600),
    [],
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setYourName(e.target.value);
    updateYourName(e.target.value);
  };

  const handleGetVerifiedEmailList = useCallback(async () => {
    setLoadingText('Fetching Data...');
    try {
      const { data } = await axios.get<VerifiedEmailAddressData[]>('/api/verified-emails');
      setVerifiedEmailList(data);
      console.log('verifiedEmailList', data);
    } catch (err) {
      console.log(err);
    }
    setLoadingText('');
  }, []);

  useEffect(() => {
    handleGetVerifiedEmailList();
  }, [handleGetVerifiedEmailList]);

  return (
    <div>
      <Navbar />
      <VerifyEmailModal showModal={showVerifyEmailModal} onClose={() => setShowVerifyEmailModal(false)} />
      <Container sx={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <Box component="section" sx={{ marginBottom: '2rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <Typography variant="h2" sx={{ fontSize: '2rem', marginRight: '2rem' }}>
              Verified Emails
            </Typography>
            <Button variant="contained" onClick={() => setShowVerifyEmailModal(true)}>
              Add Email
            </Button>
          </Box>

          {verifiedEmailList.length > 0 ? (
            <VerifiedEmailsTable verifiedEmailList={verifiedEmailList} setVerifiedEmailList={setVerifiedEmailList} />
          ) : (
            <p>
              Looks like you currently don&lsquo; t have any verified email addresses associated with this account.
              Click add email to begin the verification process.
            </p>
          )}
        </Box>

        <Box component="section" sx={{ marginBottom: '2rem' }}>
          <Typography variant="h2" sx={{ fontSize: '2rem', marginBottom: '2rem' }}>
            Compose Email
          </Typography>
          <Grid container spacing={4} sx={{ marginBottom: '30px' }}>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                id="studentSelect"
                fullWidth
                options={students}
                value={selectedStudent}
                onChange={(event: any, newValue: Student | null) => {
                  setSelectedStudent(newValue);
                }}
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} size="small" label="Select a Student" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DatePicker
                multiple
                style={{ width: '100%' }}
                sort
                format="MM/DD/YYYY"
                value={lessonDates}
                onChange={setLessonDates}
                render={(value: any, openCalender: any) => (
                  <TextField
                    fullWidth
                    value={value}
                    onClick={() => openCalender()}
                    size="small"
                    label="Select Lesson Dates"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                value={yourName}
                onChange={(e) => handleNameChange(e)}
                size="small"
                label="Your Name"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
      {loadingText && <LoadingModal text={loadingText} />}
    </div>
  );
};

export default Email;
