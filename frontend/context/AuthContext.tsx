import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Defineerime konteksti tüübi
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Loome konteksti vaikeseaded
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  login: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Laadimise olek
  const router = useRouter();

  // Kontrollime, kas kasutaja on autentitud ja seadistame oleku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken'); // Kontrollime localStorage't
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Lõpetame laadimise
    }
  }, []);

  // Suuname kasutaja, kui ta pole autentitud ja üritab pääseda kaitstud lehele
  useEffect(() => {
    const publicRoutes = ['/login', '/register']; // Lehed, kuhu saab ilma autentimiseta
    if (
      !loading &&
      !isAuthenticated &&
      !publicRoutes.includes(router.pathname)
    ) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  const login = (token: string) => {
    localStorage.setItem('authToken', token); // Salvestame tokeni
    setIsAuthenticated(true);
    router.push('/'); // Suuname dashboardile
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Eemaldame tokeni
    setIsAuthenticated(false);
    router.replace('/login'); // Suuname login-lehele
  };

  if (loading) {
    return null; // Laadimise ajal ei renderda midagi
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ekspordime hooki, et kasutada konteksti
export const useAuth = () => useContext(AuthContext);
