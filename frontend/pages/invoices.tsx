import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import InvoiceTable from "../components/InvoiceTable";

const InvoicesPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <Layout>
      <InvoiceTable />
    </Layout>
  );
};

export default InvoicesPage;
