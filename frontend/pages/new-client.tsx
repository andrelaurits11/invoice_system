import LayoutMain from '@/components/LayoutMain';
import NewClientForm from '@/components/NewClientForm';
import { useAuth } from '@/context/AuthContext';

const NewClientPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }
  return (
    <LayoutMain>
      <NewClientForm />
    </LayoutMain>
  );
};
export default NewClientPage;
