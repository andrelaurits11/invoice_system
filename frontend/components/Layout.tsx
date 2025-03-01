import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen w-full bg-gray-100'>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
