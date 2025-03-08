import React, { useState } from 'react';
import Layout from '../components/Layout';
import InvoicePreview, { InvoiceDocument } from '../components/InvoicePreview';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import Select from 'react-select';
import { SingleValue } from 'react-select';

interface InvoiceDetails {
  dueDate: string;
  invoiceID: string;
  items: InvoiceItem[];
  pdf?: string; // Optional property for PDF (base64 or file URL)
}

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  businessname: string;
  logo_picture?: string | null;
}
interface CompanyDetails {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface InvoiceItem {
  description: string;
  rate: string;
  quantity: string;
}

interface InvoiceDetails {
  dueDate: string;
  invoiceID: string;
  items: InvoiceItem[];
}

interface Client {
  id: number;
  company_name: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const fetchProfileData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data; // Siit tuleb kasutaja profiili andmed
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
};

const NewInvoiceForm = () => {
  const [status, setStatus] = useState<string>('makse_ootel');
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    businessname: '',
  });
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  // Pildi laadimine Base64 formaadis
  const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Pildi laadimine ebaõnnestus');

      const blob = await response.blob();
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Pildi laadimine ebaõnnestus:', error);
      return '/Test-IMG.png';
    }
  };
  const [logoBase64, setLogoBase64] = useState<string>('/Test-IMG.png');

  useEffect(() => {
    if (profile.logo_picture) {
      const imageUrl = `/api/storage/${profile.logo_picture}`;

      console.log('Pildi URL:', imageUrl);
      fetchImageAsBase64(imageUrl).then(setLogoBase64);
    }
  }, [profile.logo_picture]);

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
    dueDate: '',
    invoiceID: '',
    items: [{ description: '', rate: '', quantity: '' }],
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const getProfileData = async () => {
      const profileData = await fetchProfileData();
      setProfile(profileData);
    };
    getProfileData();
  }, []);

  const handleCompanyChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setCompanyDetails((prev) => ({ ...prev, [name]: value }));

    if (name === 'name' && value.length > 2) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/clients?name=${value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        );

        if (response.data) {
          const filteredClients = response.data.filter((client: Client) =>
            client.company_name.toLowerCase().includes(value.toLowerCase()),
          );
          setClients(filteredClients);
          setShowDropdown(true);
        } else {
          setClients([]);
          setShowDropdown(false);
        }
      } catch (error) {
        setClients([]);
        setShowDropdown(false);
      }
    } else {
      setClients([]);
      setShowDropdown(false);
    }
  };
  const selectClient = (client: Client) => {
    setCompanyDetails({
      name: client.company_name,
      email: client.email,
      phone: client.phone,
      address1: client.address,
      address2: client.address2 || '',
      city: client.city || '',
      state: client.state || '',
      zip: client.zip || '',
      country: client.country || '',
    });
    setShowDropdown(false);
  };

  const handleInvoiceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...invoiceDetails.items];
    updatedItems[index][name as keyof InvoiceItem] = value;
    setInvoiceDetails((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setInvoiceDetails((prev) => ({
      ...prev,
      items: [...prev.items, { description: '', rate: '', quantity: '' }],
    }));
  };

  const removeItem = (index: number) => {
    setInvoiceDetails((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const generatePDF = async (
    companyDetails: CompanyDetails,
    invoiceDetails: InvoiceDetails,
    profile: Profile,
    logoBase64: string,
  ): Promise<Blob | null> => {
    try {
      console.log('🛠 Kontrollime `InvoicePreview` andmeid:', {
        companyDetails,
        invoiceDetails,
        profile,
      });

      const pdfDoc = (
        <InvoiceDocument
          companyDetails={companyDetails}
          invoiceDetails={invoiceDetails}
          profile={profile}
          logoBase64={logoBase64}
        />
      );

      console.log('✅ `InvoicePreview` JSX:', pdfDoc);

      const pdfBlob = await pdf(pdfDoc).toBlob();

      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error('❌ PDF genereerimine ebaõnnestus, fail on tühi.');
      }

      console.log('✅ PDF edukalt loodud! Suurus:', pdfBlob.size, 'baiti');

      return pdfBlob;
    } catch (error) {
      console.error('❌ Viga PDF genereerimisel:', error);
      return null;
    }
  };

  const saveInvoice = async () => {
    const payload = {
      invoice_id: invoiceDetails.invoiceID,
      company_name: companyDetails.name,
      email: companyDetails.email,
      phone: companyDetails.phone,
      address1: companyDetails.address1,
      address2: companyDetails.address2,
      city: companyDetails.city,
      state: companyDetails.state,
      zip: companyDetails.zip,
      country: companyDetails.country,
      due_date: invoiceDetails.dueDate,
      status: status,
      items: invoiceDetails.items.map((item) => ({
        description: item.description,
        rate: parseFloat(item.rate) || 0,
        quantity: parseInt(item.quantity) || 0,
      })),
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/invoices',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 201) {
        alert('Arve salvestatud edukalt!'); // Teavitus
        router.push('/invoices');
      }
    } catch {
      alert('Arve salvestamine ebaõnnestus!'); // Veateavitus
    }
  };

  const saveAndSendInvoice = async () => {
    try {
      console.log('🚀 Alustan arve salvestamist ja saatmist...');

      // 1️⃣ Koosta andmed arve salvestamiseks
      const invoiceID = invoiceDetails.invoiceID || 'default';
      const fileName = `invoice_${invoiceID}.pdf`;

      const payload = {
        invoice_id: invoiceID,
        company_name: companyDetails.name || 'MISSING_NAME',
        email: companyDetails.email || 'MISSING_EMAIL',
        phone: String(companyDetails.phone || ''),
        address1: companyDetails.address1 || '',
        address2: companyDetails.address2 || '',
        city: companyDetails.city || '',
        state: companyDetails.state || '',
        zip: String(companyDetails.zip || ''),
        country: companyDetails.country || '',
        due_date: invoiceDetails.dueDate || 'MISSING_DATE',
        status: status,
        items: invoiceDetails.items.map((item) => ({
          description: item.description || 'MISSING_DESCRIPTION',
          rate: isNaN(parseFloat(item.rate)) ? 0 : parseFloat(item.rate),
          quantity: isNaN(parseInt(item.quantity))
            ? 0
            : parseInt(item.quantity),
        })),
      };

      console.log(
        '📦 Saadan payload serverisse:',
        JSON.stringify(payload, null, 2),
      );

      // 2️⃣ Salvesta arve serverisse
      console.log('📤 Saadan arve andmed serverisse...');
      const saveResponse = await axios.post(
        'http://localhost:8000/api/invoices',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (saveResponse.status !== 201) {
        throw new Error(' Arve salvestamine ebaõnnestus.');
      }

      console.log('✅ Arve salvestatud edukalt!');

      // 3️⃣ Genereeri PDF
      console.log('🔍 Genereerin PDF-i...');
      const pdfBlob = await generatePDF(
        companyDetails,
        invoiceDetails,
        profile,
        logoBase64,
      );

      if (!pdfBlob) {
        console.error('❌ `generatePDF` tagastas `null`, PDF-i ei loodud!');
        alert('PDF genereerimine ebaõnnestus!');
        return;
      }

      console.log('✅ PDF genereeritud!');

      // 📥 4️⃣ Konverteeri PDF Base64 formaati
      const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]); // Eemaldame data: prefixi
            } else {
              reject(new Error('Base64 konverteerimine ebaõnnestus'));
            }
          };
          reader.onerror = reject;
        });
      };

      const pdfBase64 = await blobToBase64(pdfBlob);

      // 5️⃣ Kontrollime kasutaja ID-d
      const storedUserId = localStorage.getItem('user_id');
      const userId = profile.id || storedUserId;

      console.log('🟢 Kasutaja ID:', userId);

      if (!userId) {
        console.error('❌ Kasutaja ID puudub! E-kirja saatmine peatatud.');
        alert('Viga: Kasutaja ID puudub!');
        return;
      }

      // 6️⃣ Saada PDF e-mailiga
      const requestData = {
        email: companyDetails.email || 'MISSING_EMAIL',
        invoiceDetails: {
          invoiceID: invoiceID,
        },
        pdf: pdfBase64, // Base64 formaadis PDF
        fileName: fileName, // Failinimi lisatakse e-kirja andmetesse
        user_id: userId, // ✅ Lisa user_id
      };

      console.log('📤 Saadan arve e-mailiga...');
      const sendResponse = await axios.post(
        'http://localhost:8000/api/invoices/send',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      console.log(`✅ Serveri vastus:`, sendResponse.data);
      console.log(`✅ Arve saadetud e-mailiga failinimega: ${fileName}`);

      alert('Arve salvestatud ja saadetud edukalt!');
      router.push('/invoices');
    } catch (error) {
      console.error('❌ Tekkinud viga:', error);

      if (axios.isAxiosError(error) && error.response) {
        console.error('⚠️ Serveri vastus:', error.response.data);
        alert(`Viga: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Arve salvestamine ja saatmine ebaõnnestus.');
      }
    }
  };

  const statusOptions = [
    { label: 'Makse ootel', value: 'makse_ootel' },
    { label: 'Maksutd', value: 'makstud' },
    { label: 'Ootel', value: 'ootel' },
    { label: 'Osaliselt makstud', value: 'osaliselt_makstud' },
  ];

  const handleStatusChange = (
    newValue: SingleValue<{ label: string | undefined; value: string }> | null,
  ) => {
    if (newValue !== null) {
      setStatus(newValue.value); // Kasutame value-d, kuna status on ainult string
    }
  };

  return (
    <Layout>
      <div className='flex min-h-screen flex-col'>
        <div className='flex flex-1'>
          <div className='flex flex-1 flex-col bg-gray-50 p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <input
                type='text'
                placeholder='Otsi...'
                className='w-1/3 rounded border border-gray-300 p-2'
              />
              <Link href='/new-invoice'>
                <button className='rounded bg-blue-500 px-4 py-2 text-white'>
                  Uus Arve
                </button>
              </Link>
            </div>

            <div className='grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3'>
              <div className='rounded bg-white p-6 shadow lg:col-span-2'>
                <h2 className='mb-4 text-lg font-semibold'>Ettevõtte Andmed</h2>
                <form className='grid grid-cols-2 gap-4'>
                  <div className='relative'>
                    <input
                      className='w-full rounded border p-2'
                      placeholder='Search for a company'
                      name='name'
                      value={companyDetails.name}
                      onChange={handleCompanyChange}
                    />
                    {showDropdown && (
                      <ul className='absolute z-50 max-h-40 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg'>
                        {clients.length > 0 ? (
                          clients.map((client) => (
                            <li
                              key={client.id}
                              className='cursor-pointer p-2 text-black hover:bg-gray-100'
                              onClick={() => selectClient(client)}
                            >
                              {client.company_name || 'Unnamed Client'}
                            </li>
                          ))
                        ) : (
                          <li className='p-2 text-gray-500'>
                            No results found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

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
                </form>
                <h2 className='mb-4 mt-6 text-lg font-semibold'>Arve Andmed</h2>

                <form>
                  <Select
                    options={statusOptions}
                    value={{
                      label: statusOptions.find(
                        (option) => option.value === status,
                      )?.label,
                      value: status,
                    }}
                    onChange={handleStatusChange}
                  />

                  <input
                    className='mb-3 w-full rounded border p-2'
                    placeholder='Maksetähtaeg'
                    name='dueDate'
                    value={invoiceDetails.dueDate}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        dueDate: e.target.value,
                      })
                    }
                  />
                  <input
                    className='mb-3 w-full rounded border p-2'
                    placeholder='Arve ID'
                    name='invoiceID'
                    value={invoiceDetails.invoiceID}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        invoiceID: e.target.value,
                      })
                    }
                  />
                  {invoiceDetails.items.map((item, index) => (
                    <div key={index} className='mb-3 grid grid-cols-12 gap-4'>
                      <input
                        className='col-span-5 rounded border p-2'
                        placeholder='Kirjeldus'
                        name='description'
                        value={item.description}
                        onChange={(e) => handleInvoiceChange(e, index)}
                      />
                      <input
                        className='col-span-3 rounded border p-2'
                        placeholder='Hind'
                        name='rate'
                        value={item.rate}
                        onChange={(e) => handleInvoiceChange(e, index)}
                      />
                      <input
                        className='col-span-2 rounded border p-2'
                        placeholder='Kogus'
                        name='quantity'
                        value={item.quantity}
                        onChange={(e) => handleInvoiceChange(e, index)}
                      />
                      <div className='col-span-2 flex h-full items-center justify-center space-x-2'>
                        <button
                          type='button'
                          className='flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white'
                          onClick={() => removeItem(index)}
                        >
                          -
                        </button>
                        <button
                          type='button'
                          className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white'
                          onClick={addItem}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </form>
              </div>
              <div className='rounded bg-white p-6 shadow'>
                <div id='invoice-preview'>
                  <InvoicePreview
                    companyDetails={companyDetails}
                    invoiceDetails={invoiceDetails}
                    profile={profile}
                    logoBase64={logoBase64}
                  />
                </div>
              </div>
            </div>
            <div className='mt-6 flex items-center justify-end space-x-4'>
              <button
                onClick={saveInvoice}
                className='rounded bg-gray-300 px-4 py-2 text-gray-700'
              >
                Salvesta
              </button>
              <button
                onClick={saveAndSendInvoice}
                className='rounded bg-blue-500 px-4 py-2 text-white'
              >
                Salvesta ja Saada
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewInvoiceForm;
