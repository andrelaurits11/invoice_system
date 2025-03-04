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
        } flex flex-col bg-slate-900 p-5 text-white transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='mb-7 self-end rounded bg-slate-900 p-2 text-white'
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {isOpen && <h2 className='mb-4 text-lg font-semibold'>Töölaud</h2>}

        <nav className='flex flex-col space-y-4'>
          <button
            onClick={() => router.push('/')}
            className={`flex items-center space-x-3 p-2 text-sm ${
              isActive('/') ? 'font-semibold text-blue-300' : 'text-gray-300'
            }`}
          >
            <Home size={24} />
            {isOpen && <span>Töölaud</span>}
          </button>

          <button
            onClick={() => router.push('/invoices')}
            className={`flex items-center space-x-3 p-2 text-sm ${
              isActive('/invoices')
                ? 'font-semibold text-blue-300'
                : 'text-gray-300'
            }`}
          >
            <FileText size={24} />
            {isOpen && <span>Arved</span>}
          </button>

          <button
            onClick={() => router.push('/clients')}
            className={`flex items-center space-x-3 p-2 text-sm ${
              isActive('/clients')
                ? 'font-semibold text-blue-300'
                : 'text-gray-300'
            }`}
          >
            <Users size={24} />
            {isOpen && <span>Kliendid</span>}
          </button>

          <button
            onClick={() => router.push('/profile')}
            className={`flex items-center space-x-3 p-2 text-sm ${
              isActive('/profile')
                ? 'font-semibold text-blue-300'
                : 'text-gray-300'
            }`}
          >
            <User size={24} />
            {isOpen && <span>Profiil</span>}
          </button>

          {/* Logout nupp */}
          <button
            onClick={logout}
            className='mt-auto flex items-center space-x-3 rounded bg-red-500 p-2 text-sm text-white'
          >
            <LogOut size={24} />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
