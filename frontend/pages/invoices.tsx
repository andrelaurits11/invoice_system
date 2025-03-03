import { useAuth } from '../context/AuthContext';
import LayoutMain from '../components/LayoutMain';
import InvoiceTable from '../components/InvoiceTable';

const InvoicesPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <LayoutMain>
      <InvoiceTable />
    </LayoutMain>
  );
};

export default InvoicesPage;
