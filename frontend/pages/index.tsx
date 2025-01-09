import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../components/Dashboard";
import Layout from "../components/Layout";

const Homepage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Kontrollime autentimist
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // Kui kasutaja pole autentitud, suuname login-lehele
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Kui kasutaja pole autentitud, ei renderda midagi
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Homepage;
