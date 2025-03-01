import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import EditInvoice from '../components/EditInvoice';

const EditInvoicePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <Layout>
      <EditInvoice />
    </Layout>
  );
};

export default EditInvoicePage;
