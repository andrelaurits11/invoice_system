import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import router from 'next/router';
import { Pencil } from 'lucide-react';

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
    <div className='flex'>
      <div className='flex-1 bg-gray-50 p-6'>
        <div className='mb-6 flex flex-col gap-4 rounded-lg bg-gray-100 p-4 text-sm shadow'>
          <div className='flex items-center justify-between gap-4'>
            <input
              type='text'
              placeholder='Otsi kliendi nime järgi...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-[40rem] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
            />
            <Link href='/new-client'>
              <button className='flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 text-white shadow-md transition hover:bg-blue-600'>
                Uus Klient
              </button>
            </Link>
          </div>
        </div>

        <table className='w-full border-collapse rounded bg-white shadow'>
          <thead>
            <tr className='border-b text-left'>
              <th className='px-4 py-3'>Ettevõtte</th>
              <th className='px-4 py-3'>Kontakt</th>
              <th className='px-4 py-3'>Email</th>
              <th className='px-4 py-3'>Telefon</th>
              <th className='px-4 py-3'></th>
            </tr>
          </thead>
          <tbody>
            {displayedClients.length > 0 ? (
              displayedClients.map((client) => (
                <tr className='border-b' key={client.id}>
                  <td className='px-4 py-3'>{client.company_name}</td>
                  <td className='px-4 py-3'>{client.contact_person}</td>
                  <td className='px-4 py-3'>{client.email}</td>
                  <td className='px-4 py-3'>{client.phone}</td>
                  <td className='px-4 py-3'>
                    <button
                      onClick={() =>
                        router.push(`/edit-client?id=${client.id}`)
                      }
                      className='flex items-center justify-center rounded bg-blue-400 px-3 py-2 text-white hover:bg-blue-600'
                    >
                      <Pencil className='h-5 w-5 stroke-[1.8]' />
                    </button>
                  </td>
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
