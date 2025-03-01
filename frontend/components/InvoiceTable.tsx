import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  rate: number;
  quantity: number;
}

interface Invoice {
  id: number;
  invoice_id: number;
  company_name: string;
  due_date: string;
  status: string;
  total: number;
  pdf_path: string;
  items: InvoiceItem[];
}

const InvoiceTable = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/invoices', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      let responseData = response.data;

      if (typeof responseData === 'string') {
        const cleanData = responseData.replace(/<[^>]*>/g, '').trim();
        try {
          responseData = JSON.parse(cleanData);
        } catch (error) {
          console.error('Puhastatud JSON pole kehtiv:', cleanData);
          throw error;
        }
      }

      if (Array.isArray(responseData)) {
        setInvoices(responseData);
      } else {
        console.error('API vastus ei ole massiiv:', responseData);
        setInvoices([]);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      alert('Failed to fetch invoices.');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className='flex h-screen'>
      <div className='w-1/5 bg-gray-100 p-6'>
        <h2 className='mb-6 text-xl font-bold'>Arved</h2>
        <nav className='flex flex-col space-y-4'>
          <button onClick={() => router.push('/')} className='text-gray-600'>
            Töölaud
          </button>
          <button
            onClick={() => router.push('/invoices')}
            className='font-semibold text-blue-500'
          >
            Arved
          </button>
          <button
            onClick={() => router.push('/clients')}
            className='text-gray-600'
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
          <Link href='/new-invoice'>
            <button className='rounded bg-blue-500 px-4 py-2 text-white'>
              Uus Arve
            </button>
          </Link>
        </div>

        <table className='w-full border-collapse rounded bg-white shadow'>
          <thead>
            <tr className='border-b text-left'>
              <th className='py-2'>Arve ID</th>
              <th className='py-2'>Kuupäev</th>
              <th className='py-2'>Klient</th>
              <th className='py-2'>Staatus</th>
              <th className='py-2'>Kokku</th>
              <th className='py-2'></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(invoices) && invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr className='border-b' key={invoice.id}>
                  <td className='py-2'>{invoice.invoice_id}</td>
                  <td className='py-2'>{invoice.due_date}</td>
                  <td className='py-2'>{invoice.company_name || 'N/A'}</td>
                  <td className='py-2'>{invoice.status}</td>
                  <td className='py-2'>{invoice.total}</td>
                  <td className='py-2'>
                    <button
                      onClick={() =>
                        router.push(`/edit-invoice?id=${invoice.id}`)
                      }
                      className='rounded bg-blue-500 px-4 py-2 text-white'
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='py-4 text-center text-gray-500'>
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
