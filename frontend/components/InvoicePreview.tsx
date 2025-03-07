/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from '@react-pdf/renderer';

// Stiilide määratlus PDF jaoks
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyInfo: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  titleContainer: {
    textAlign: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  amountContainer: {
    backgroundColor: '#377dff',
    color: '#fff',
    padding: 15,
    borderRadius: 5,
    textAlign: 'right',
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  clientDetails: {
    marginVertical: 20,
  },
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientInfo: {
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  clientLabel: {
    color: '#888',
    fontWeight: 'bold',
  },
  clientData: {
    color: '#000',
    marginTop: 2,
  },
  countryFix: {
    flex: 1,
    textAlign: 'left',
    marginLeft: -170,
    paddingHorizontal: 10,
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableCellHeader: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#377dff',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    color: '#555',
  },
  logo: {
    width: 'auto',
    height: 'auto',
    maxWidth: 80,
    maxHeight: 80,
    objectFit: 'contain',
    resizeMode: 'contain',
    borderRadius: 40,
  },
});

// Tüüpide määratlus
interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  businessname: string;
  logo_picture?: string | null;
}
interface CompanyDetails {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface InvoiceItem {
  description: string;
  rate: string;
  quantity: string;
}

interface InvoiceDetails {
  dueDate: string;
  invoiceID: string;
  items: InvoiceItem[];
}

interface PDFViewerProps {
  companyDetails: CompanyDetails;
  invoiceDetails: InvoiceDetails;
  profile: Profile;
  logoBase64: string;
}

// Pildi laadimine Base64 formaadis
const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Pildi laadimine ebaõnnestus');

    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Pildi laadimine ebaõnnestus:', error);
    return '/Test-IMG.png';
  }
};

// PDF-i sisu
const InvoiceDocument: React.FC<{
  companyDetails: CompanyDetails;
  invoiceDetails: InvoiceDetails;
  profile: Profile;
  logoBase64: string;
}> = ({ companyDetails, invoiceDetails, profile, logoBase64 }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        {logoBase64 ? <Image src={logoBase64} style={styles.logo} /> : null}
        <View style={styles.companyInfo}>
          <Text style={{ fontWeight: 'bold' }}>{profile.businessname}</Text>
          <Text>{}</Text>
          <Text>{profile.address}</Text>
          <Text>{profile.address2}</Text>
          <Text>
            {profile.city}, {profile.state}, {profile.zip}
          </Text>
          <Text>{profile.country}</Text>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text>
          Total Amount:{' '}
          {invoiceDetails.items
            .reduce(
              (sum, item) =>
                sum +
                parseFloat(item.rate || '0') * parseFloat(item.quantity || '0'),
              0,
            )
            .toFixed(2)}
          €
        </Text>
      </View>

      <View style={styles.clientDetails}>
        <View style={styles.clientRow}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientLabel}>Client</Text>
            <Text style={styles.clientData}>{companyDetails.name}</Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientLabel}>Address</Text>
            <Text style={styles.clientData}>{companyDetails.address1}</Text>
          </View>
          <View style={styles.clientInfo}>
            <Text style={styles.clientLabel}>Address</Text>
            <Text style={styles.clientData}>
              {companyDetails.address2} {companyDetails.zip}{' '}
              {companyDetails.state}
            </Text>
          </View>
        </View>
        <View style={styles.clientRow}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientLabel}>City</Text>
            <Text style={styles.clientData}>{companyDetails.city}</Text>
          </View>
          <View style={styles.countryFix}>
            <Text style={styles.clientLabel}>Country</Text>
            <Text style={styles.clientData}>{companyDetails.country}</Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCellHeader}>Description</Text>
          <Text style={styles.tableCellHeader}>Rate</Text>
          <Text style={styles.tableCellHeader}>Qty</Text>
          <Text style={styles.tableCellHeader}>Total</Text>
        </View>
        {invoiceDetails.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.rate}€</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>
              {(
                parseFloat(item.rate) * parseFloat(item.quantity || '0')
              ).toFixed(2)}
              €
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Peavaate komponent
const InvoicePreviewPDF: React.FC<PDFViewerProps> = ({
  companyDetails,
  invoiceDetails,
  profile,
}) => {
  const [logoBase64, setLogoBase64] = useState<string>('/Test-IMG.png');

  useEffect(() => {
    if (profile.logo_picture) {
      const imageUrl = `/api/storage/${profile.logo_picture}`;

      console.log('Pildi URL:', imageUrl);
      fetchImageAsBase64(imageUrl).then(setLogoBase64);
    }
  }, [profile.logo_picture]);

  return (
    <PDFViewer style={{ width: '100%', height: '500px' }}>
      <InvoiceDocument
        companyDetails={companyDetails}
        invoiceDetails={invoiceDetails}
        profile={profile}
        logoBase64={logoBase64}
      />
    </PDFViewer>
  );
};
export { InvoiceDocument };
export default InvoicePreviewPDF;
