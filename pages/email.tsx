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

// Context
import { AppContext } from '../context';

// Types
import { VerifiedEmailAddressData, Student, PdfData } from '../types/customTypes';

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

  const [selectedVerifiedEmail, setSelectedVerifiedEmail] = useState<string>('');
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [pdfData, setPdfData] = useState<PdfData | null>(null);

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

  /* 
  data:application/pdf;base64,JVBERi0xLjMKJf////8KOSAwIG9iago8PAovVHlwZSAvRXh0R1N0YXRlCi9jYSAxCj4+CmVuZG9iagoxMiAwIG9iago8PAovUyAvVVJJCi9VUkkgKGh0dHBzOi8vYWNjb3VudC52ZW5tby5jb20vdS9NYXJrLU11bGxpZ2FuLTQpCj4+CmVuZG9iagoxMyAwIG9iago8PAovU3VidHlwZSAvTGluawovQSAxMiAwIFIKL1R5cGUgL0Fubm90Ci9SZWN0IFsyNzAuNTY0MDE2IDY0NS44OTAwMDkgMzcxLjExMjAxNiA2NjEuMjkwMDA5XQovQm9yZGVyIFswIDAgMF0KL0YgNAo+PgplbmRvYmoKOCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDU5NS4yODAwMjkgODQxLjg5MDAxNV0KL0NvbnRlbnRzIDYgMCBSCi9SZXNvdXJjZXMgNyAwIFIKL1VzZXJVbml0IDEKL0Fubm90cyBbMTMgMCBSXQo+PgplbmRvYmoKNyAwIG9iago8PAovUHJvY1NldCBbL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSV0KL0V4dEdTdGF0ZSA8PAovR3MxIDkgMCBSCj4+Ci9Gb250IDw8Ci9GMiAxMCAwIFIKL0YxIDExIDAgUgo+Pgo+PgplbmRvYmoKMTUgMCBvYmoKKHJlYWN0LXBkZikKZW5kb2JqCjE2IDAgb2JqCihyZWFjdC1wZGYpCmVuZG9iagoxNyAwIG9iagooRDoyMDIzMDIxNjIzMjcyNVopCmVuZG9iagoxNCAwIG9iago8PAovUHJvZHVjZXIgMTUgMCBSCi9DcmVhdG9yIDE2IDAgUgovQ3JlYXRpb25EYXRlIDE3IDAgUgo+PgplbmRvYmoKMTEgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagoxMCAwIG9iago8PAovVHlwZSAvRm9udAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkCi9TdWJ0eXBlIC9UeXBlMQovRW5jb2RpbmcgL1dpbkFuc2lF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MDAxMDgzIDAwMDAwIG4gCjAwMDAwMDA5MzkgMDAwMDAgbiAKMDAwMDAwMDkxOCAwMDAwMCBuIAowMDAwMDAxMTMwIDAwMDAwIG4gCjAwMDAwMDExNzMgMDAwMDAgbiAKMDAwMDAwMDQyMCAwMDAwMCBuIAowMDAwMDAwMjczIDAwMDAwIG4gCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDgxNSAwMDAwMCBuIAowMDAwMDAwNzE3IDAwMDAwIG4gCjAwMDAwMDAwNTkgMDAwMDAgbiAKMDAwMDAwMDE0MCAwMDAwMCBuIAowMDAwMDAwNjQxIDAwMDAwIG4gCjAwMDAwMDA1NDkgMDAwMDAgbiAKMDAwMDAwMDU3NyAwMDAwMCBuIAowMDAwMDAwNjA1IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgMTgKL1Jvb3QgMyAwIFIKL0luZm8gMTQgMCBSCi9JRCBbPDhmYzY2MWRiNDU1NTQzMDMwMGIyOGI2ZGI4YWQyNmVmPiA8OGZjNjYxZGI0NTU1NDMwMzAwYjI4YjZkYjhhZDI2ZWY+XQo+PgpzdGFydHhyZWYKMjY0NgolJUVPRgo=
  */

  const renderPDFToString = async () => {
    if (pdfData) {
      let blobPdf = await pdf(<InvoicePDFTemplate1 data={pdfData} />).toBlob();
      // returns data:application/pdf;base64,---base64string
      const pdfBase64 = await readFile(blobPdf);
      // extract only the base 64 string;
      return pdfBase64.split(',')[1];
    }
  };

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

    const base64Pdf = await renderPDFToString();
    const emailFrom = verifiedEmailList.find((email) => email.id === selectedVerifiedEmail);

    console.log({
      emailFrom: emailFrom?.emailAddress,
      emailTo,
      subject,
      message,
      base64Pdf,
    });
  };

  const handleGetStudents = useCallback(async () => {
    try {
      const { data } = await axios.get<Student[]>('/api/students');
      setStudents(data);
    } catch (err) {
      console.log(err);
    }
  }, [setStudents]);

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
  }, [handleGetVerifiedEmailList]);

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
    </div>
  );
};

export default Email;
