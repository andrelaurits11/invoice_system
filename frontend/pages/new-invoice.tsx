import LayoutMain from '@/components/LayoutMain';
import NewInvoiceForm from '@/components/NewInvoiceForm';
import { useAuth } from '@/context/AuthContext';

const NewInvoiceFormPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }
  return (
    <LayoutMain>
      <NewInvoiceForm />
    </LayoutMain>
  );
};
export default NewInvoiceFormPage;
