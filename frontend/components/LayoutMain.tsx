import { ReactNode } from 'react';
import Sidebar from './SideBar';

interface LayoutProps {
  children: ReactNode;
}

const LayoutMain = ({ children }: LayoutProps) => {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='min-h-screen flex-1 bg-gray-50 p-6'>{children}</div>
    </div>
  );
};

export default LayoutMain;
