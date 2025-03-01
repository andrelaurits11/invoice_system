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
      await axios.post('http://localhost:8000/api/clients', companyDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Klient salvestatud edukalt!');
      router.push('/clients');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || 'Kliendi salvestamine ebaõnnestus!',
        );
      } else {
        setError('Tekkis ootamatu viga!');
      }
    }
  };

  return (
    <Layout>
      <div className='flex h-screen flex-col'>
        <div className='flex flex-1'>
          <div className='flex w-1/5 flex-col bg-gray-100 p-6'>
            <h2 className='mb-6 text-xl font-bold'>Arved</h2>
            <nav className='flex flex-col space-y-4'>
              <button
                onClick={() => router.push('/')}
                className='text-gray-600'
              >
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

          <div className='flex flex-1 flex-col bg-gray-50 p-6'>
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

            <div className='rounded bg-white p-6 shadow lg:col-span-2'>
              <h2 className='mb-4 text-lg font-semibold'>Ettevõtte Andmed</h2>
              <form onSubmit={saveClient} className='grid grid-cols-2 gap-4'>
                <input
                  className='col-span-2 w-full rounded border p-2'
                  placeholder='Name'
                  name='name'
                  value={companyDetails.name}
                  onChange={handleCompanyChange}
                />
                <input
                  className='col-span-2 w-full rounded border p-2'
                  placeholder='Contact Person'
                  name='contactPerson'
                  value={companyDetails.contactPerson}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='Email'
                  name='email'
                  value={companyDetails.email}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='Phone'
                  name='phone'
                  value={companyDetails.phone}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='Address 1'
                  name='address1'
                  value={companyDetails.address1}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='Address 2'
                  name='address2'
                  value={companyDetails.address2}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='City'
                  name='city'
                  value={companyDetails.city}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='State'
                  name='state'
                  value={companyDetails.state}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='Zip'
                  name='zip'
                  value={companyDetails.zip}
                  onChange={handleCompanyChange}
                />
                <input
                  className='rounded border p-2'
                  placeholder='Country'
                  name='country'
                  value={companyDetails.country}
                  onChange={handleCompanyChange}
                />
                <button
                  type='submit'
                  className='col-span-2 rounded bg-blue-500 px-4 py-2 text-white'
                >
                  Salvesta
                </button>
                {error && <p className='col-span-2 text-red-500'>{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
