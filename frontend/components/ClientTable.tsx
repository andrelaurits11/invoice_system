import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

interface Client {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  created_at: string;
}

const ClientTable = () => {
  useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const clientsPerPage = 15;

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/clients', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Sorteerime kõige uuemad kõige ette
      const sortedClients = response.data.sort(
        (a: Client, b: Client) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setClients(sortedClients);
    } catch {
      alert('Failed to fetch clients.');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtreerime otsingu järgi
  const filteredClients = clients.filter((client) =>
    client.company_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Arvutame lehekülgede koguarvu
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  // Näitame ainult valitud lehe kliente
  const displayedClients = filteredClients.slice(
    (currentPage - 1) * clientsPerPage,
    currentPage * clientsPerPage,
  );

  return (
    <div className='flex h-screen'>
      <div className='flex-1 bg-gray-50 p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <input
            type='text'
            placeholder='Otsi kliendi nime järgi...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            {displayedClients.length > 0 ? (
              displayedClients.map((client) => (
                <tr className='border-b' key={client.id}>
                  <td className='border p-2'>{client.company_name}</td>
                  <td className='border p-2'>{client.contact_person}</td>
                  <td className='border p-2'>{client.email}</td>
                  <td className='border p-2'>{client.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className='py-4 text-center text-gray-500'>
                  Kliendid puuduvad
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredClients.length > clientsPerPage && (
          <div className='mt-4 flex justify-center'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='mx-2 rounded bg-gray-300 px-4 py-2 disabled:opacity-50'
            >
              Eelmine
            </button>
            <span className='mx-2'>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className='mx-2 rounded bg-gray-300 px-4 py-2 disabled:opacity-50'
            >
              Järgmine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientTable;
