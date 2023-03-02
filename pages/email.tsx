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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// React Multi Date Picker
import DatePicker from 'react-multi-date-picker';

// react-pdf
import { pdf } from '@react-pdf/renderer';

// Components
import Navbar from '../components/Navbar';
import VerifyEmailModal from '../components/modals/VerifyEmailModal';
import VerifiedEmailsTable from '../components/tables/VerifiedEmailsTable';
import LoadingModal from '../components/LoadingModal';
import InvoicePDFTemplate1 from '../pdf/InvoicePDFTemplate1';
import EmailPreviewModal from '../components/modals/EmailPreviewModal';
import SentEmailsTable from '../components/tables/SentEmailsTable';

// Context
import { AppContext } from '../context';

// Types
import { VerifiedEmailAddressData, Student, PdfData, SentEmail } from '../types/customTypes';

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
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [sentEmails, setSentEmails] = useState<SentEmail[]>([]);

  const [selectedVerifiedEmail, setSelectedVerifiedEmail] = useState<string>('');
  const [emailFrom, setEmailFrom] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [pdfData, setPdfData] = useState<PdfData | null>(null);

  const createPDFData = useCallback(() => {
    if (!session || !selectedStudent || !lessonDates || !(lessonDates.length > 0)) {
      return;
    }

    let months: string[] = [];

    const lessonDateStrings = lessonDates.map((lessonDate: any) => {
      if (!months.includes(lessonDate.month.name)) {
        months.push(lessonDate.month.name);
      }

      return `${lessonDate.month}/${lessonDate.day}/${lessonDate.year}`;
    });

    const newPdfData: PdfData = {
      yourName: debouncedName,
      venmoUsername: userInfo.venmoUsername,
      paypalUsername: userInfo.paypalUsername,
      zelle: userInfo.zelle,
      studentName: selectedStudent.name,
      parentName: selectedStudent.parentName,
      parentEmail: selectedStudent.parentEmail,
      lessonAmount: selectedStudent.lessonAmount,
      months: months,
      lessonDates: lessonDateStrings,
      totalAmount: selectedStudent.lessonAmount * lessonDateStrings.length,
    };

    setPdfData(newPdfData);
  }, [session, selectedStudent, lessonDates, debouncedName, userInfo]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateYourName = useCallback(
    debounce((value) => setDebouncedName(value), 600),
    [],
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setYourName(e.target.value);
    updateYourName(e.target.value);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailFrom = verifiedEmailList.find((email) => email.id === selectedVerifiedEmail);
    setEmailFrom(emailFrom?.emailAddress || '');
    setShowEmailPreview(true);
  };

  const handleGetStudents = useCallback(async () => {
    try {
      const { data } = await axios.get<Student[]>('/api/students');
      setStudents(data);
    } catch (err) {
      console.log(err);
    }
  }, [setStudents]);

  const handleGetSentEmails = useCallback(async () => {
    try {
      const { data } = await axios.get<SentEmail[]>('/api/send-email');
      console.log(data);
      setSentEmails(data);
    } catch (err) {
      console.log(err);
    }
  }, [setSentEmails]);

  const handleGetVerifiedEmailList = useCallback(async () => {
    setLoadingText('Fetching Data...');
    try {
      const { data } = await axios.get<VerifiedEmailAddressData[]>('/api/verified-emails');
      setVerifiedEmailList(data);
      if (data.length > 0) {
        setSelectedVerifiedEmail(data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
    setLoadingText('');
  }, []);

  useEffect(() => {
    handleGetVerifiedEmailList();
    handleGetSentEmails();
  }, [handleGetVerifiedEmailList, handleGetSentEmails]);

  useEffect(() => {
    if (session?.user?.name) {
      setYourName(session.user.name);
      setDebouncedName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (!hasFetchedStudents) {
      handleGetStudents();
      setHasFetchedStudents(true);
    }
  }, [handleGetStudents, hasFetchedStudents, setHasFetchedStudents]);

  useEffect(() => {
    if (selectedStudent) {
      setEmailTo(selectedStudent.parentEmail);
    }
  }, [selectedStudent]);

  useEffect(() => {
    if (selectedStudent && lessonDates && lessonDates.length > 0) {
      const tempMonthsArr: string[] = [];

      lessonDates.forEach((date: any) => {
        if (!tempMonthsArr.includes(date.month.name)) {
          tempMonthsArr.push(date.month.name);
        }
      });

      setSubject(`Lesson Invoice - ${tempMonthsArr.join('-')}`);
    }
  }, [selectedStudent, lessonDates]);

  useEffect(() => {
    if (lessonDates && selectedStudent) {
      createPDFData();
    }
  }, [lessonDates, selectedStudent, createPDFData]);

  return (
    <div>
      <Navbar />
      <VerifyEmailModal
        verifiedEmails={verifiedEmailList}
        showModal={showVerifyEmailModal}
        onClose={() => setShowVerifyEmailModal(false)}
        setVerifiedEmails={setVerifiedEmailList}
      />
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
            Sent Emails
          </Typography>
          <SentEmailsTable sentEmails={sentEmails} />
        </Box>

        <Box component="section" sx={{ marginBottom: '2rem' }}>
          <Typography variant="h2" sx={{ fontSize: '2rem', marginBottom: '2rem' }}>
            Compose Email
          </Typography>
          <Box component="form" onSubmit={handleEmailSubmit}>
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
                  renderInput={(params) => <TextField {...params} size="small" label="Select a Student" required />}
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
                      required
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
                  required
                  fullWidth
                  value={yourName}
                  onChange={(e) => handleNameChange(e)}
                  size="small"
                  label="Your Name"
                />
              </Grid>
              {selectedStudent && lessonDates && (
                <>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel id="fromEmailSelect">From Email</InputLabel>
                      <Select
                        required
                        size="small"
                        labelId="fromEmailSelect"
                        id="emailFromSelect"
                        value={selectedVerifiedEmail}
                        label="From Email"
                        onChange={(e) => setSelectedVerifiedEmail(e.target.value)}
                      >
                        {verifiedEmailList.map((email) => {
                          return (
                            <MenuItem key={email.id} value={email.id}>
                              {email.emailAddress}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      fullWidth
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      size="small"
                      label="To Email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      fullWidth
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      size="small"
                      label="Subject"
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      label="Message"
                      fullWidth
                      placeholder="Type your message here..."
                      multiline
                      minRows={8}
                      maxRows={10}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Button variant="contained" type="submit">
              Send Email
            </Button>
          </Box>
        </Box>
      </Container>
      {loadingText && <LoadingModal text={loadingText} />}
      <EmailPreviewModal
        showModal={showEmailPreview}
        onClose={() => setShowEmailPreview(false)}
        emailFrom={emailFrom}
        emailTo={emailTo}
        subject={subject}
        message={message}
        pdfData={pdfData}
      />
    </div>
  );
};

export default Email;
