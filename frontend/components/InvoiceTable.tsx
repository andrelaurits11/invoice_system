import { useState, useEffect, useCallback } from 'react';
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
  created_at: string;
  status: string;
  total: number;
  pdf_path: string;
  items: InvoiceItem[];
}

const InvoiceTable = () => {
  const router = useRouter();
  useAuth();
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('-created_at');

  const invoicesPerPage = 15;

  const statusMap: { [key: string]: string } = {
    makse_ootel: 'Makse ootel',
    makstud: 'Makstud',
    ootel: 'Ootel',
    osaliselt_makstud: 'Osaliselt makstud',
  };

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/invoices', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        params: { sort: '-created_at' }, // Sortimine serveri poolt
      });

      if (Array.isArray(response.data)) {
        setAllInvoices(response.data);
      } else {
        console.error('API vastus ei ole massiiv:', response.data);
        setAllInvoices([]);
      }
    } catch (error) {
      console.error('Arvete laadimine ebaõnnestus:', error);
      alert('Arvete laadimine ebaõnnestus.');
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filteredInvoices = allInvoices
    .filter((invoice) =>
      statusFilter ? invoice.status === statusFilter : true,
    )
    .filter((invoice) =>
      searchQuery
        ? invoice.invoice_id.toString().includes(searchQuery) ||
          invoice.company_name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true,
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === '-created_at' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  const displayedInvoices = filteredInvoices.slice(
    (currentPage - 1) * invoicesPerPage,
    currentPage * invoicesPerPage,
  );

  return (
    <div className='flex'>
      {/* Main Content */}
      <div className='flex-1 bg-gray-50 p-6'>
        <div className='mb-6 flex items-center justify-between'>
          {/* Filters */}
          <div className='flex space-x-4'>
            <select
              className='rounded border p-2'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value=''>Kõik staatused</option>
              {Object.keys(statusMap).map((status) => (
                <option key={status} value={status}>
                  {statusMap[status]}
                </option>
              ))}
            </select>

            <input
              type='text'
              placeholder='Otsi arvet või klienti...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='rounded border p-2'
            />

            <select
              className='rounded border p-2'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='-created_at'>Uuemad esimesena</option>
              <option value='created_at'>Vanemad esimesena</option>
            </select>
          </div>

          <Link href='/new-invoice'>
            <button className='rounded bg-blue-500 px-4 py-2 text-white'>
              Uus Arve
            </button>
          </Link>
        </div>

        {/* Invoice Table */}
        <table className='w-full border-collapse rounded bg-white shadow'>
          <thead>
            <tr className='border-b text-left'>
              <th className='py-2'>Arve ID</th>
              <th className='py-2'>Loodud</th>
              <th className='py-2'>Klient</th>
              <th className='py-2'>Staatus</th>
              <th className='py-2'>Kokku</th>
              <th className='py-2'></th>
            </tr>
          </thead>
          <tbody>
            {displayedInvoices.length > 0 ? (
              displayedInvoices.map((invoice) => (
                <tr className='border-b' key={invoice.id}>
                  <td className='py-2'>{invoice.invoice_id}</td>
                  <td className='py-2'>
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className='py-2'>{invoice.company_name || 'N/A'}</td>
                  <td className='py-2'>
                    {statusMap[invoice.status] || invoice.status}
                  </td>
                  <td className='py-2'>{invoice.total} €</td>
                  <td className='py-2'>
                    <button
                      onClick={() =>
                        router.push(`/edit-invoice?id=${invoice.id}`)
                      }
                      className='rounded bg-blue-500 px-4 py-2 text-white'
                    >
                      Muuda
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='py-4 text-center text-gray-500'>
                  Arveid ei leitud
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredInvoices.length > invoicesPerPage && (
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

export default InvoiceTable;
