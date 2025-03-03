import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home, FileText, Users, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } flex flex-col bg-gray-900 p-4 text-white transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='mb-6 self-end rounded bg-gray-800 p-2 text-white'
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && <h2 className='mb-6 text-xl font-bold'>Töölaud</h2>}

        <nav className='flex flex-col space-y-6'>
          <button
            onClick={() => router.push('/')}
            className={`flex items-center space-x-3 p-2 ${
              isActive('/') ? 'font-semibold text-blue-300' : 'text-gray-300'
            }`}
          >
            <Home size={28} />
            {isOpen && <span className='text-lg'>Töölaud</span>}
          </button>

          <button
            onClick={() => router.push('/invoices')}
            className={`flex items-center space-x-3 p-2 ${
              isActive('/invoices')
                ? 'font-semibold text-blue-300'
                : 'text-gray-300'
            }`}
          >
            <FileText size={28} />
            {isOpen && <span className='text-lg'>Arved</span>}
          </button>

          <button
            onClick={() => router.push('/clients')}
            className={`flex items-center space-x-3 p-2 ${
              isActive('/clients')
                ? 'font-semibold text-blue-300'
                : 'text-gray-300'
            }`}
          >
            <Users size={28} />
            {isOpen && <span className='text-lg'>Kliendid</span>}
          </button>

          <button
            onClick={() => router.push('/profile')}
            className={`flex items-center space-x-3 p-2 ${
              isActive('/profile')
                ? 'font-semibold text-blue-300'
                : 'text-gray-300'
            }`}
          >
            <User size={28} />
            {isOpen && <span className='text-lg'>Profiil</span>}
          </button>

          {/* Logout nupp */}
          <button
            onClick={logout}
            className='mt-auto flex items-center space-x-3 rounded bg-red-500 p-3 text-white'
          >
            <LogOut size={28} />
            {isOpen && <span className='text-lg'>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
