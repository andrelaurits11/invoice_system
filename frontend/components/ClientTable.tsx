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
    <div className="flex h-screen">
      <div className="bg-gray-100 w-1/5 p-6">
        <h2 className="text-xl font-bold mb-6">Kliendid</h2>
        <nav className="flex flex-col space-y-4">
          <button onClick={() => router.push('/')} className="text-gray-600">
            Töölaud
          </button>
          <button onClick={() => router.push('/invoices')} className="text-gray-600">
            Arved
          </button>
          <button onClick={() => router.push('/clients')} className="text-blue-500 font-semibold">
            Kliendid
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Otsi..."
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
          <Link href="/new-client">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Uus Klient</button>
          </Link>
        </div>

        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Company</th>
              <th className="py-2">Contact</th>
              <th className="py-2">Email</th>
              <th className="py-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr className="border-b" key={client.id}>
                <td className="border p-2">{client.company_name}</td>
                <td className="border p-2">{client.contact_person}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">{client.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;
