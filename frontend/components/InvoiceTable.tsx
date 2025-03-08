import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight, Filter, Pencil, X } from 'lucide-react';

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

  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('-created_at');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const invoicesPerPage = 15;
  const statuses = ['makse_ootel', 'makstud', 'ootel', 'osaliselt_makstud'];
  const statusMap: { [key: string]: string } = {
    makse_ootel: 'Makse ootel',
    makstud: 'Makstud',
    ootel: 'Ootel',
    osaliselt_makstud: 'Osaliselt makstud',
  };

  const fetchInvoices = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          params: { sort: '-created_at' }, // Sortimine serveri poolt
        },
      );

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
      statusFilter.length > 0 ? statusFilter.includes(invoice.status) : true,
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

  const getPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };
  const clearFilters = () => {
    setSelectedStatuses([]);
  };

  return (
    <div className='flex'>
      {/* Main Content */}
      <div className='flex-1 bg-gray-50 p-6'>
        {/* Filter ja otsing */}
        <div className='mb-6 flex flex-col gap-4 rounded-lg bg-gray-100 p-4 text-sm shadow'>
          {/* Ülemine rida - Otsing ja "Uus Arve" nupp */}
          <div className='flex items-center justify-between gap-4'>
            {/* Otsing */}
            <input
              type='text'
              placeholder='Otsi arvet...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-[40rem] rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
            />

            {/* "Uus Arve" nupp */}
            <button
              onClick={() => router.push(`/new-invoice`)}
              className='flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2 text-white shadow-md transition hover:bg-blue-600'
            >
              Uus Arve
            </button>
          </div>

          {/* Alumine rida - Filtrid ja sorteerimine */}
          <div className='flex flex-wrap items-center justify-between gap-4'>
            {/* Vasak - Staatuse filter */}
            <div className='relative flex items-center gap-4'>
              <button
                className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm hover:bg-gray-200'
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className='h-4 w-4' /> Filtrid
              </button>

              {/* Puhasta kõik nupp */}
              {selectedStatuses.length > 0 && (
                <button
                  onClick={clearFilters}
                  className='text-blue-500 hover:text-blue-600'
                >
                  Puhasta kõik
                </button>
              )}

              {/* Dropdown menu */}
              {isFilterOpen && (
                <div className='absolute left-0 top-full z-10 mt-2 w-48 rounded-lg bg-white p-3 shadow-lg'>
                  {statuses.map((status) => (
                    <label
                      key={status}
                      className='flex items-center gap-2 py-1'
                    >
                      <input
                        type='checkbox'
                        checked={selectedStatuses.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className='h-4 w-4'
                      />
                      {statusMap[status]}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Parem - Sorteerimine */}
            <select
              className='rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='-created_at'>Uuemad esimesena</option>
              <option value='created_at'>Vanemad esimesena</option>
            </select>
          </div>

          {/* Filtrite valikud (nagu mustad märgendid) */}
          {selectedStatuses.length > 0 && (
            <div className='mt-4 flex w-full flex-wrap gap-2'>
              {selectedStatuses.map((status) => (
                <span
                  key={status}
                  className='flex items-center gap-2 rounded-full bg-black px-3 py-1 text-white'
                >
                  {statusMap[status]}
                  <X
                    className='h-4 w-4 cursor-pointer'
                    onClick={() => toggleStatus(status)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Invoice Table */}
        <table className='w-full border-collapse rounded bg-white shadow'>
          <thead>
            <tr className='border-b text-left'>
              <th className='px-4 py-3'>Arve ID</th>
              <th className='px-4 py-3'>Loodud</th>
              <th className='px-4 py-3'>Klient</th>
              <th className='px-4 py-3'>Staatus</th>
              <th className='px-4 py-3'>Kokku</th>
              <th className='px-4 py-3'></th>
            </tr>
          </thead>
          <tbody>
            {displayedInvoices.length > 0 ? (
              displayedInvoices.map((invoice) => (
                <tr className='border-b' key={invoice.id}>
                  <td className='px-4 py-3'>{invoice.invoice_id}</td>
                  <td className='px-4 py-3'>
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3'>{invoice.company_name || 'N/A'}</td>
                  <td className='px-4 py-3'>
                    {statusMap[invoice.status] || invoice.status}
                  </td>
                  <td className='px-4 py-3'>{invoice.total} €</td>
                  <td className='px-4 py-3'>
                    <button
                      onClick={() =>
                        router.push(`/edit-invoice?id=${invoice.id}`)
                      }
                      className='flex items-center justify-center rounded bg-blue-400 px-3 py-2 text-white hover:bg-blue-600'
                    >
                      <Pencil className='h-5 w-5 stroke-[1.8]' />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='px-4 py-3 text-center text-gray-500'>
                  Arveid ei leitud
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className='mt-4 flex items-center justify-center space-x-4'>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className='flex items-center space-x-2 text-gray-600 hover:text-gray-900'
          >
            <ChevronLeft className='h-5 w-5 stroke-[1.8]' />
            <span className='font-medium'>Previous</span>
          </button>

          <div className='flex space-x-2'>
            {getPagination().map((page, index) => (
              <button
                key={index}
                className={`rounded-md px-3 py-1 ${
                  page === currentPage
                    ? 'bg-blue-100 font-bold text-blue-600'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            className='flex items-center space-x-2 text-gray-600 hover:text-gray-900'
          >
            <span className='font-medium'>Next</span>
            <ChevronRight className='h-5 w-5 stroke-[1.8]' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
