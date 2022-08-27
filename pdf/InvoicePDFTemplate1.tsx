// React
import { FC } from 'react';

// Libraies
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Create styles
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#E4E4E4',
  },
  name: {
    marginTop: 10,
    marginBottom: 5,
    color: '#a75e19',
    fontSize: 40,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: 100,
    color: '#4b9fa7',
  },
  phone: {
    fontSize: 14,
  },
  subTitle: {
    fontSize: 20,
    marginBottom: 2,
    color: '#a75e19',
  },
  size14: {
    fontSize: 14,
  },
  header: {
    margin: 15,
    padding: 15,
  },
  section: {
    margin: 15,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    width: '50%',
  },
  tableSection: {
    fontSize: 16,
    margin: 15,
    padding: 15,
  },
  tableCell: {
    borderBottom: 1,
    paddingTop: 12,
    paddingLeft: 5,
  },
  tableCellNoBorder: {
    paddingTop: 12,
    paddingRight: 7,
    textAlign: 'right',
  },
});

interface IProps {
  data: {
    yourName: string;
    yourEmail: string;
    yourNumber: string;
    parentName: string;
    parentEmail: string;
    studentName: string;
  };
}

// Create Document Component
const MyDocument: FC<IProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Invoice</Text>
          <Text style={styles.name}>{data.yourName}</Text>
          <Link style={styles.email} src={`mailto:${data.yourEmail}`}>
            {data.yourEmail}
          </Link>
          <Text style={styles.phone}>{data.yourNumber}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.subTitle}>BILL TO</Text>

              <View style={styles.size14}>
                <Text style={{ marginBottom: 2 }}>{data?.parentName}</Text>
                <Link style={styles.email} src={`mailto:${data?.parentEmail}`}>
                  {data?.parentEmail}
                </Link>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={styles.subTitle}>FOR</Text>

              <View style={styles.size14}>
                <Text style={{ marginBottom: 2 }}>{data.studentName}</Text>
                <Text>Private Lessons</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            {/* <View style={styles.col}>
              <Text>Private Lessons (Dates)</Text>
              {props.data.lessons.map((lesson, index) => {
                return (
                  <Text style={styles.tableCell} key={`lesson-${index}`}>
                    {lesson.date}
                  </Text>
                );
              })}
              <Text style={styles.tableCellNoBorder}>Total</Text>
            </View> */}
            {/* <View style={styles.col}>
              <Text>Amount</Text>
              {props.data.lessons.map((lesson, index) => {
                return (
                  <Text style={styles.tableCell} key={`amount-${index}`}>
                    ${lesson.cost}
                  </Text>
                );
              })}
              <Text style={styles.tableCell}>${props.data.total}</Text>
            </View> */}
          </View>
        </View>

        <View style={styles.section}>
          <Text>Thank You!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
