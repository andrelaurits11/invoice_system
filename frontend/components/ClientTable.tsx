import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

interface Client {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
}

const ClientTable = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/clients', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setClients(response.data);
    } catch {
      alert('Failed to fetch clients.');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className='flex h-screen'>
      <div className='w-1/5 bg-gray-100 p-6'>
        <h2 className='mb-6 text-xl font-bold'>Kliendid</h2>
        <nav className='flex flex-col space-y-4'>
          <button onClick={() => router.push('/')} className='text-gray-600'>
            Töölaud
          </button>
          <button
            onClick={() => router.push('/invoices')}
            className='text-gray-600'
          >
            Arved
          </button>
          <button
            onClick={() => router.push('/clients')}
            className='font-semibold text-blue-500'
          >
            Kliendid
          </button>
          <button
            onClick={logout}
            className='mt-4 rounded bg-red-500 px-4 py-2 text-white'
          >
            Logout
          </button>
        </nav>
      </div>

      <div className='flex-1 bg-gray-50 p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <input
            type='text'
            placeholder='Otsi...'
            className='w-1/3 rounded border border-gray-300 p-2'
          />
          <Link href='/new-client'>
            <button className='rounded bg-blue-500 px-4 py-2 text-white'>
              Uus Klient
            </button>
          </Link>
        </div>

        <table className='w-full border-collapse rounded bg-white shadow'>
          <thead>
            <tr className='border-b text-left'>
              <th className='py-2'>Company</th>
              <th className='py-2'>Contact</th>
              <th className='py-2'>Email</th>
              <th className='py-2'>Phone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr className='border-b' key={client.id}>
                <td className='border p-2'>{client.company_name}</td>
                <td className='border p-2'>{client.contact_person}</td>
                <td className='border p-2'>{client.email}</td>
                <td className='border p-2'>{client.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
