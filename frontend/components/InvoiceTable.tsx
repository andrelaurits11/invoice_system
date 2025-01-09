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
    <div className="flex h-screen">
      <div className="bg-gray-100 w-1/5 p-6">
        <h2 className="text-xl font-bold mb-6">Arved</h2>
        <nav className="flex flex-col space-y-4">
          <button onClick={() => router.push('/')} className="text-gray-600">
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

      <div className="flex-1 bg-gray-50 p-6">
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

        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Arve ID</th>
              <th className="py-2">Kuupäev</th>
              <th className="py-2">Klient</th>
              <th className="py-2">Staatus</th>
              <th className="py-2">Kokku</th>
              <th className="py-2">PDF</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(invoices) && invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr className="border-b" key={invoice.id}>
                  <td className="py-2">{invoice.invoice_id}</td>
                  <td className="py-2">{invoice.due_date}</td>
                  <td className="py-2">{invoice.company_name || 'N/A'}</td>
                  <td className="py-2">{invoice.status}</td>
                  <td className="py-2">{invoice.total}</td>
                  <td className="py-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${invoice.pdf_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PDF
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
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
