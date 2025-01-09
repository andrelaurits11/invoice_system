import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import ClientTable from "../components/ClientTable";

const ClientsPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <Layout>
      <ClientTable />
    </Layout>
  );
};

export default ClientsPage;
