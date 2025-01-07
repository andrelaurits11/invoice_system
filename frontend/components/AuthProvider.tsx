import React from 'react';
import { AuthProvider } from '../context/AuthContext';

const ProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ProviderWrapper;
