import { useAuth } from '../context/AuthContext';
import LayoutMain from '../components/Layout';
import EditInvoice from '../components/EditInvoice';

const EditInvoicePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <LayoutMain>
      <EditInvoice />
    </LayoutMain>
  );
};

export default EditInvoicePage;
