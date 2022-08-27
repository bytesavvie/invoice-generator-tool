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
  header: {
    margin: 15,
    padding: 15,
  },
  invoiceTitle: {
    color: '#283592',
    fontFamily: 'Helvetica-Bold',
    fontSize: 40,
  },
  heroSection: {
    paddingRight: 30,
    paddingLeft: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  text: {
    fontFamily: 'Helvetica',
    marginBottom: 4,
    fontSize: 16,
  },
  divider: {
    marginTop: 40,
    marginLeft: 29,
    marginRight: 29,
    borderBottom: '1px solid black',
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
  size14: {
    fontSize: 14,
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
          <Text style={styles.invoiceTitle}>Invoice</Text>
        </View>

        <View style={styles.heroSection}>
          <View>
            <Text style={styles.subTitle}>Invoice For</Text>
            <Text style={styles.text}>{data.parentName}</Text>
            <Text style={styles.text}>{data.parentEmail}</Text>
          </View>
          <View>
            <Text style={styles.subTitle}>Payable To</Text>
            <Text style={styles.text}>{data.yourName}</Text>
          </View>
          <View>
            <Text style={styles.subTitle}>Invoice</Text>
            <Text style={styles.text}>April/May Lessons</Text>
          </View>
        </View>

        <View style={styles.divider}>
          <Text style={styles.text}>{data.studentName}</Text>
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
