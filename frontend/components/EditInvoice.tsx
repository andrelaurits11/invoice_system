import React, { useState } from 'react';
import Layout from './Layout';
import InvoicePreview from './InvoicePreview';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect } from 'react';
import Select from 'react-select';

interface Profile {
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

const fetchProfileData = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/profile`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      },
    );
    return response.data; // Siit tuleb kasutaja profiili andmed
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
};

const EditInvoice = () => {
  const router = useRouter();
  const { id } = router.query;
  const [status, setStatus] = useState<string>('makse_ootel');
  const [profile, setProfile] = useState<Profile>({
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

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
    dueDate: '',
    invoiceID: '',
    items: [{ description: '', rate: '', quantity: '' }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lae arve andmed
        const invoiceResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        );

        const invoiceData = invoiceResponse.data;

        setCompanyDetails({
          name: invoiceData.company_name,
          email: invoiceData.email,
          phone: invoiceData.phone,
          address1: invoiceData.address1,
          address2: invoiceData.address2 || '',
          city: invoiceData.city || '',
          state: invoiceData.state || '',
          zip: invoiceData.zip || '',
          country: invoiceData.country || '',
        });

        setInvoiceDetails({
          dueDate: invoiceData.due_date,
          invoiceID: invoiceData.invoice_id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items: invoiceData.items.map((item: any) => ({
            description: item.description,
            rate: item.rate.toString(),
            quantity: item.quantity.toString(),
          })),
        });

        // Lae profiili andmed
        const profileData = await fetchProfileData();
        setProfile(profileData);
      } catch (error) {
        console.error('Viga andmete laadimisel:', error);
      }
    };

    if (id) fetchData();
  }, [id]);

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
  const statusOptions = [
    { label: 'Makse ootel', value: 'makse_ootel' },
    { label: 'Makstud', value: 'makstud' },
    { label: 'Ootel', value: 'ootel' },
    { label: 'Osaliselt makstud', value: 'osaliselt_makstud' },
  ];
  // Funktsioon, et käsitleda Select muutusi
  const handleStatusChange = (selectedOption: { value: string } | null) => {
    if (selectedOption) {
      setStatus(selectedOption.value);
    }
  };
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
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      alert('Invoice updated successfully!');
      router.push('/invoices');
    } catch (error) {
      console.error('Failed to update invoice:');
      alert('Failed to update invoice.');
    }
  };

  return (
    <Layout>
      <div className='flex min-h-screen flex-col'>
        <div className='flex flex-1'>
          <div className='flex flex-1 flex-col bg-gray-50 p-6'>
            <div className='grid flex-1 grid-cols-1 gap-6 lg:grid-cols-3'>
              <div className='rounded bg-white p-6 shadow lg:col-span-2'>
                <h2 className='mb-4 text-lg font-semibold'>Edit Invoice</h2>
                <div className='mb-4'>
                  <Select
                    options={statusOptions}
                    value={
                      statusOptions.find((option) => option.value === status) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      handleStatusChange(selectedOption)
                    }
                  />
                </div>
                {invoiceDetails.items.map((item, index) => (
                  <div key={index} className='mb-3 grid grid-cols-12 gap-4'>
                    <input
                      className='col-span-5 rounded border p-2'
                      placeholder='Description'
                      name='description'
                      value={item.description}
                      onChange={(e) => handleInvoiceChange(e, index)}
                    />
                    <input
                      className='col-span-3 rounded border p-2'
                      placeholder='Rate'
                      name='rate'
                      value={item.rate}
                      onChange={(e) => handleInvoiceChange(e, index)}
                    />
                    <input
                      className='col-span-2 rounded border p-2'
                      placeholder='Quantity'
                      name='quantity'
                      value={item.quantity}
                      onChange={(e) => handleInvoiceChange(e, index)}
                    />
                    <div className='col-span-2 flex items-center justify-center'>
                      <button
                        type='button'
                        className='rounded bg-red-500 px-2 text-white'
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'
                  onClick={addItem}
                >
                  Add Item
                </button>
              </div>
              <div className='rounded bg-white p-6 shadow'>
                <InvoicePreview
                  companyDetails={companyDetails}
                  invoiceDetails={invoiceDetails}
                  profile={profile}
                  logoBase64={logoBase64}
                />
              </div>
            </div>
            <div className='mt-6 flex items-center justify-end space-x-4'>
              <button
                className='rounded bg-blue-500 px-4 py-2 text-white'
                onClick={saveInvoice}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditInvoice;
