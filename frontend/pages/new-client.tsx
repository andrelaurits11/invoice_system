import { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import axios from 'axios';

interface CompanyDetails {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function NewClient() {
  const router = useRouter();
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));
  };

  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        'http://localhost:8000/api/clients',
        companyDetails,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Klient salvestatud edukalt!');
      router.push('/clients');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Kliendi salvestamine ebaõnnestus!');
      } else {
        setError('Tekkis ootamatu viga!');
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="flex flex-1">
          <div className="bg-gray-100 w-1/5 p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Arved</h2>
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

          <div className="flex-1 bg-gray-50 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <input
                type="text"
                placeholder="Otsi..."
                className="w-1/3 p-2 border border-gray-300 rounded"
              />
              <Link href="/new-client">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Uus Klient
                </button>
              </Link>
            </div>

            <div className="bg-white p-6 shadow rounded lg:col-span-2">
              <h2 className="font-semibold text-lg mb-4">Ettevõtte Andmed</h2>
              <form onSubmit={saveClient} className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded w-full col-span-2"
                  placeholder="Name"
                  name="name"
                  value={companyDetails.name}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded w-full col-span-2"
                  placeholder="Contact Person"
                  name="contactPerson"
                  value={companyDetails.contactPerson}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Email"
                  name="email"
                  value={companyDetails.email}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Phone"
                  name="phone"
                  value={companyDetails.phone}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Address 1"
                  name="address1"
                  value={companyDetails.address1}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Address 2"
                  name="address2"
                  value={companyDetails.address2}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="City"
                  name="city"
                  value={companyDetails.city}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="State"
                  name="state"
                  value={companyDetails.state}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Zip"
                  name="zip"
                  value={companyDetails.zip}
                  onChange={handleCompanyChange}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="Country"
                  name="country"
                  value={companyDetails.country}
                  onChange={handleCompanyChange}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded col-span-2"
                >
                  Salvesta
                </button>
                {error && <p className="text-red-500 col-span-2">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
