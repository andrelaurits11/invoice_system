import { useAuth } from '../context/AuthContext';
import LayoutMain from '../components/LayoutMain';
import EditClient from '../components/EditClient';

const EditClientPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <LayoutMain>
      <EditClient />
    </LayoutMain>
  );
};

export default EditClientPage;
