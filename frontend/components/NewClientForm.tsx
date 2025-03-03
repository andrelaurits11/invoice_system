import { useState } from 'react';
import { useRouter } from 'next/router';
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

const NewClientForm = () => {
  const router = useRouter();
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
    <div className='rounded bg-white p-6 shadow'>
      <h2 className='mb-4 text-lg font-semibold'>Ettevõtte Andmed</h2>
      <form onSubmit={saveClient} className='grid grid-cols-2 gap-4'>
        <input
          className='col-span-2 w-full rounded border p-2'
          placeholder='Ettevõtte nimi'
          name='name'
          value={companyDetails.name}
          onChange={handleCompanyChange}
        />
        <input
          className='col-span-2 w-full rounded border p-2'
          placeholder='Kontaktisik'
          name='contactPerson'
          value={companyDetails.contactPerson}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='E-mail'
          name='email'
          value={companyDetails.email}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='Telefon'
          name='phone'
          value={companyDetails.phone}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='Aadress 1'
          name='address1'
          value={companyDetails.address1}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='Aadress 2'
          name='address2'
          value={companyDetails.address2}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='Linn'
          name='city'
          value={companyDetails.city}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='Maakond'
          name='state'
          value={companyDetails.state}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='Sihtnumber'
          name='zip'
          value={companyDetails.zip}
          onChange={handleCompanyChange}
        />
        <input
          className='rounded border p-2'
          placeholder='Riik'
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
  );
};

export default NewClientForm;
