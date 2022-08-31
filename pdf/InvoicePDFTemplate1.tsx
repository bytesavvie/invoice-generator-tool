// React
import { FC } from 'react';

// Libraies
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

// Create styles
// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fbfbfb',
  },
  blueTop: {
    height: 40,
    backgroundColor: '#283592',
  },
  header: {
    margin: 15,
    padding: 15,
  },
  invoiceTitle: {
    color: '#283592',
    fontFamily: 'Helvetica-Bold',
    fontSize: 36,
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
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontFamily: 'Helvetica',
    marginBottom: 4,
    fontSize: 14,
  },
  divider: {
    marginTop: 30,
    marginBottom: 20,
    marginLeft: 29,
    marginRight: 29,
    borderBottom: '1px solid black',
  },
  spacer: {
    marginTop: 50,
  },
  gridHeader: {
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    paddingTop: 5,
    paddingBottom: 5,
  },
  gridDark: {
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    padding: 3,
    backgroundColor: '#bebebe',
  },
  gridLight: {
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 30,
    padding: 3,
    backgroundColor: '#f2f2f2',
  },
  tableHeader: {
    color: '#283592',
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
  },
  col1: {
    width: '30%',
  },
  col2: {
    width: '30%',
    textAlign: 'right',
  },
  col3: {
    width: '40%',
    textAlign: 'right',
  },
  name: {
    marginTop: 10,
    marginBottom: 5,
    color: '#a75e19',
    fontSize: 40,
  },
  section: {
    margin: 15,
    padding: 15,
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 30,
    paddingRight: 30,
  },
  totalPriceLabel: {
    fontFamily: 'Helvetica',
    color: '#283592',
    fontSize: 14,
  },
  totalPrice: {
    marginLeft: 15,
    fontFamily: 'Helvetica',
    fontSize: 14,
  },
});

interface IProps {
  data: {
    yourName: string;
    parentName: string;
    parentEmail: string;
    studentName: string;
    lessonAmount: number;
    months: string[];
    lessonDates: string[];
    totalAmount: number;
  };
}

// Create Document Component
const MyDocument: FC<IProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.blueTop}></View>
        <View style={styles.header}>
          <Text style={styles.invoiceTitle}>Invoice</Text>
        </View>

        <View style={styles.heroSection}>
          <View>
            <Text style={styles.subTitle}>Invoice For</Text>
            {data.parentName && <Text style={styles.text}>{data.parentName}</Text>}

            <Text style={styles.text}>{data.parentEmail}</Text>
          </View>
          <View>
            <Text style={styles.subTitle}>Payable To</Text>
            <Text style={styles.text}>{data.yourName}</Text>
          </View>
          <View>
            <Text style={styles.subTitle}>Invoice</Text>
            <Text style={styles.text}>{data.months.join('/')} Lessons</Text>
          </View>
        </View>

        <View style={styles.spacer}></View>
        <View style={styles.divider}>
          <Text style={styles.text}>{data.studentName}</Text>
        </View>
        <View style={styles.gridHeader}>
          <View style={styles.col1}>
            <Text style={styles.tableHeader}>Description</Text>
          </View>
          <View style={styles.col2}>
            <Text style={styles.tableHeader}>Qty</Text>
          </View>
          <View style={styles.col3}>
            <Text style={styles.tableHeader}>Price</Text>
          </View>
        </View>

        {data.lessonDates.map((date, index) => {
          return (
            <View key={date} style={index % 2 !== 0 ? styles.gridLight : styles.gridDark}>
              <View style={styles.col1}>
                <Text style={styles.text}>{date}</Text>
              </View>
              <View style={styles.col2}>
                <Text style={styles.text}>{index + 1}</Text>
              </View>
              <View style={styles.col3}>
                <Text style={styles.text}>${data.lessonAmount}</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.divider}></View>
        <View style={styles.totalPriceRow}>
          <View>
            <Text style={styles.totalPriceLabel}>Total Price</Text>
          </View>
          <View>
            <Text style={styles.totalPrice}>${data.totalAmount}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
