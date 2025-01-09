import React, { useState } from 'react';
import Layout from '../components/Layout';
import InvoicePreview from '../components/InvoicePreview';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import axios from 'axios';

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

export default function NewInvoice() {
  const router = useRouter();
  const { logout } = useAuth();

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

  const [clients, setClients] = useState<Client[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCompanyChange = async (
    e: React.ChangeEvent<HTMLInputElement>
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
          }
        );

        if (response.data) {
          const filteredClients = response.data.filter((client: Client) =>
            client.company_name.toLowerCase().includes(value.toLowerCase())
          );
          setClients(filteredClients);
          setShowDropdown(true);
        } else {
          setClients([]);
          setShowDropdown(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            'Error fetching clients:',
            error.response?.data || error.message
          );
        } else {
          console.error('Unexpected error:', error);
        }
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
      city: client.state || '',
      state: client.state || '',
      zip: client.zip || '',
      country: client.country || '',
    });
    setShowDropdown(false);
  };

  const handleInvoiceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
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
        }
      );

      if (response.status === 201) {
        alert('Invoice saved successfully!');
        router.push('/invoices');
      }
    } catch {
      alert('Failed to save invoice.');
    }
  };
  const saveAndSendInvoice = async () => {
    try {
      await saveInvoice(); // Save the invoice first
      await axios.post(
        'http://localhost:8000/api/invoices/send',
        {
          email: companyDetails.email,
          invoiceDetails: {
            invoice_id: invoiceDetails.invoiceID,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Invoice saved and sent successfully!');
      router.push('/invoices');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error sending invoice:',
          error.response?.data || error.message
        );
        alert(error.response?.data?.message || 'Failed to send the invoice.');
      } else {
        console.error('Unknown error:', error);
        alert('An unknown error occurred. Please try again.');
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
              <button
                onClick={() => router.push('/')}
                className="text-gray-600"
              >
                Töölaud
              </button>
              <button
                onClick={() => router.push('/invoices')}
                className="text-blue-500 font-semibold"
              >
                Arved
              </button>
              <button
                onClick={() => router.push('/clients')}
                className="text-gray-600"
              >
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
              <Link href="/new-invoice">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Uus Arve
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
              <div className="bg-white p-6 shadow rounded lg:col-span-2">
                <h2 className="font-semibold text-lg mb-4">Ettevõtte Andmed</h2>
                <form className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      className="border p-2 rounded w-full"
                      placeholder="Search for a company"
                      name="name"
                      value={companyDetails.name}
                      onChange={handleCompanyChange}
                    />
                    {showDropdown && (
                      <ul className="absolute z-50 bg-white border border-gray-300 rounded w-full max-h-40 overflow-y-auto shadow-lg">
                        {clients.length > 0 ? (
                          clients.map((client) => (
                            <li
                              key={client.id}
                              className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                              onClick={() => selectClient(client)}
                            >
                              {client.company_name || 'Unnamed Client'}
                            </li>
                          ))
                        ) : (
                          <li className="p-2 text-gray-500">
                            No results found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

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
                </form>
                <h2 className="font-semibold text-lg mb-4 mt-6">Arve Andmed</h2>
                <form>
                  <input
                    className="border p-2 w-full mb-3 rounded"
                    placeholder="Maksetähtaeg"
                    name="dueDate"
                    value={invoiceDetails.dueDate}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        dueDate: e.target.value,
                      })
                    }
                  />
                  <input
                    className="border p-2 w-full mb-3 rounded"
                    placeholder="Arve ID"
                    name="invoiceID"
                    value={invoiceDetails.invoiceID}
                    onChange={(e) =>
                      setInvoiceDetails({
                        ...invoiceDetails,
                        invoiceID: e.target.value,
                      })
                    }
                  />
                  {invoiceDetails.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 mb-3">
                      <input
                        className="border p-2 col-span-5 rounded"
                        placeholder="Kirjeldus"
                        name="description"
                        value={item.description}
                        onChange={(e) => handleInvoiceChange(e, index)}
                      />
                      <input
                        className="border p-2 col-span-3 rounded"
                        placeholder="Hind"
                        name="rate"
                        value={item.rate}
                        onChange={(e) => handleInvoiceChange(e, index)}
                      />
                      <input
                        className="border p-2 col-span-2 rounded"
                        placeholder="Kogus"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleInvoiceChange(e, index)}
                      />
                      <div className="flex col-span-2 justify-center space-x-2 items-center h-full">
                        <button
                          type="button"
                          className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full"
                          onClick={() => removeItem(index)}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="bg-blue-500 text-white w-6 h-6 flex items-center justify-center rounded-full"
                          onClick={addItem}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </form>
              </div>
              <div className="bg-white p-6 shadow rounded">
                <InvoicePreview
                  companyDetails={companyDetails}
                  invoiceDetails={invoiceDetails}
                />
              </div>
            </div>
            <div className="flex justify-end items-center mt-6 space-x-4">
              <button
                onClick={saveInvoice}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Salvesta
              </button>
              <button
                onClick={saveAndSendInvoice}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Salvesta ja Saada
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
