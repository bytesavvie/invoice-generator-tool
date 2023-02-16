// React
import { useContext, useState, useEffect, useCallback } from 'react';

// Next
import Head from 'next/head';
import type { NextPage } from 'next';

// Libraries
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { PDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { debounce } from '@mui/material';

// React Multi Date Picker
import DatePicker from 'react-multi-date-picker';

// MUI
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Context
import { AppContext } from '../context';

// Components
import Navbar from '../components/Navbar';
import InvoicePDFTemplate1 from '../pdf/InvoicePDFTemplate1';
import LoadingModal from '../components/LoadingModal';

// Types
import { Student, PdfData } from '../types/customTypes';

export const formatPDFTitle = (studentName: string, months: string[]) => {
  let formattedName = studentName.trim().split(' ').join('');
  let formattedDates = months.join('_');
  return `${formattedName}-${formattedDates}-invoice.pdf`;
};

const Invoice: NextPage = () => {
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
  const [pdfData, setPdfData] = useState<PdfData | null>(null);

  const reader = (file: any) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
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
      const pdfBase64 = await readFile(blobPdf);
      console.log(pdfBase64);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateYourName = useCallback(
    debounce((value) => setDebouncedName(value), 600),
    [],
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setYourName(e.target.value);
    updateYourName(e.target.value);
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

  const handleGetStudents = useCallback(async () => {
    try {
      const { data } = await axios.get<Student[]>('/api/students');
      setStudents(data);
    } catch (err) {
      console.log(err);
    }
  }, [setStudents]);

  useEffect(() => {
    if (session?.user?.name) {
      setYourName(session.user.name);
      setDebouncedName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.name && !hasFetchedUserInfo) {
      setHasFetchedUserInfo(true);
      setUserInfo({
        name: session.user.name,
        venmoUsername: session.user.venmoUsername || '',
        paypalUsername: session.user.paypalUsername || '',
        zelle: session.user.zelle || '',
      });
    }
  }, [session, setUserInfo, hasFetchedUserInfo, setHasFetchedUserInfo]);

  useEffect(() => {
    if (!hasFetchedStudents) {
      handleGetStudents();
      setHasFetchedStudents(true);
    }
  }, [handleGetStudents, hasFetchedStudents, setHasFetchedStudents]);

  useEffect(() => {
    if (lessonDates && selectedStudent) {
      createPDFData();
    }
  }, [lessonDates, selectedStudent, createPDFData]);

  if (status === 'loading') {
    return <LoadingModal text="loading..." />;
  }

  return (
    <div>
      <Head>
        <title>Invoice Generator - Generate Invoice</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <Container sx={{ paddingTop: '100px', paddingBottom: '100px' }}>
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

        {pdfData && (
          <>
            <PDFDownloadLink
              document={<InvoicePDFTemplate1 data={pdfData} />}
              fileName={formatPDFTitle(pdfData.studentName, pdfData.months)}
              className="btn btn-outline-dark btn-block"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : <Button variant="outlined">Download PDF</Button>
              }
            </PDFDownloadLink>
            <Button onClick={renderPDFToString}>Email</Button>
          </>
        )}

        <Box sx={{ mt: '50px' }}>
          {pdfData && (
            <PDFViewer style={{ height: 700, width: '100%' }}>
              <InvoicePDFTemplate1 data={pdfData} />
            </PDFViewer>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Invoice;
