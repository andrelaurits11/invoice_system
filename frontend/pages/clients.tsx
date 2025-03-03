import { useAuth } from '../context/AuthContext';
import LayoutMain from '../components/LayoutMain';
import ClientTable from '../components/ClientTable';

const ClientsPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <LayoutMain>
      <ClientTable />
    </LayoutMain>
  );
};

export default ClientsPage;
