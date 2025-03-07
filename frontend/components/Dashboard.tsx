import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import router from 'next/router';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface Invoice {
  invoice_id: string;
  company_name: string;
  id: number;
  type: string;
  created_at: string;
  date: string;
  client: string;
  status: string;
  total: number;
}
interface Client {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

// ✅ Funktsioon viidud ülespoole, et seda saaks kasutada enne defineerimist.
const getLastSixMonths = (): string[] => {
  const kuud = [
    'Jaanuar',
    'Veebruar',
    'Märts',
    'Aprill',
    'Mai',
    'Juuni',
    'Juuli',
    'August',
    'September',
    'Oktoober',
    'November',
    'Detsember',
  ];
  const today = new Date();
  return Array.from(
    { length: 6 },
    (_, i) => kuud[(today.getMonth() - 5 + i + 12) % 12],
  );
};

const generateChartData = (label: string, data: number[], color: string) => ({
  labels: getLastSixMonths(),
  datasets: [
    {
      label,
      data: data.length ? data : Array(6).fill(0),
      borderColor: color, // Joone värv
      backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.3)'), // ✅ Läbipaistvusega täitevärv
      fill: true, // ✅ Täida ala joone all
      borderWidth: 2,
      pointRadius: 4,
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      tension: 0.4,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      ticks: { display: false }, // ✅ Peidab kuu nimed X-teljel
      border: { display: false },
    },
    y: {
      grid: { display: false },
      ticks: { display: false },
      border: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }, // ✅ Kuu nimed jäävad tooltipi peale
  },
};

const Dashboard = () => {
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [clientData, setClientData] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Invoice[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [invoiceDataForCharts, setInvoiceDataForCharts] = useState<Invoice[]>(
    [],
  );
  const [activeTab, setActiveTab] = useState<'invoices' | 'clients'>(
    'invoices',
  );

  const statusMap: { [key: string]: string } = {
    makse_ootel: 'Makse ootel',
    makstud: 'Makstud',
    ootel: 'Ootel',
  };
  useEffect(() => {
    const fetchLatestInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/invoices', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setInvoiceData(
          response.data
            .sort(
              (a: Invoice, b: Invoice) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .slice(0, 6),
        );
      } catch (error) {
        console.error('❌ Viga viimaste arvete laadimisel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestInvoices();
  }, []);

  useEffect(() => {
    if (activeTab === 'clients') {
      const fetchClients = async () => {
        setLoadingClients(true);
        try {
          const response = await axios.get(
            'http://localhost:8000/api/clients',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
              },
            },
          );
          setClientData(
            response.data
              .sort(
                (a: Client, b: Client) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime(),
              )
              .slice(0, 6),
          );
        } catch (error) {
          console.error('❌ Viga klientide laadimisel:', error);
        } finally {
          setLoadingClients(false);
        }
      };
      fetchClients();
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchInvoiceDataForCharts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/invoices', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setInvoiceDataForCharts(response.data); // See peaks olema uus state, mida kasutame ainult diagrammides
      } catch (error) {
        console.error(
          '❌ Viga arvete andmete laadimisel diagrammide jaoks:',
          error,
        );
      }
    };

    fetchInvoiceDataForCharts();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/invoices/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          },
        );

        setSearchResults(response.data);
      } catch (error) {
        console.error('Otsing ebaõnnestus:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSearchResults, 300); // ⏳ Otsing toimub 300ms viivitusega

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const invoiceStatusData = [
    {
      title: 'Kõik Arved',
      status: '', // Kõik arved, ilma filtrita
      color: 'rgba(100, 100, 100, 0.7)', // Värv
    },
    {
      title: 'Makse ootel',
      status: 'makse_ootel',
      color: 'rgba(200, 0, 0, 0.7)',
    },
    { title: 'Ootel', status: 'ootel', color: 'rgba(0, 123, 255, 1)' },
    { title: 'Makstud', status: 'makstud', color: 'rgba(0, 200, 0, 0.7)' },
  ];

  // Funktsioon, mis töötab välja kõigi arvete kokkuvõtte.
  const processInvoiceData = (status: Invoice['status']): string => {
    const today = new Date();
    const lastMonth = today.getMonth(); // Viimane kuu (praegune kuu)
    const lastMonthYear = today.getFullYear(); // Viimane kuu aasta

    // NumberFormatter funktsioon summa vormindamiseks
    const numberFormatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Kui seisund on tühi, siis summeerime kõik arved, mis on eelmisel kuul.
    if (status === '') {
      const sum = invoiceDataForCharts
        .filter((invoice) => {
          const invoiceDate = new Date(invoice.created_at);
          return (
            invoiceDate.getMonth() === lastMonth && // Kontrollime, kas kuu on viimane
            invoiceDate.getFullYear() === lastMonthYear // Kontrollime, kas aasta on õige
          );
        })
        .reduce((sum, invoice) => sum + Number(invoice.total), 0);

      return numberFormatter.format(sum); // Tagastame vormindatud numbri
    }

    // Kui on konkreetne seisund, siis summeerime ainult selle seisundiga arvete summad eelmisel kuul.
    const sum = invoiceDataForCharts
      .filter((invoice) => {
        const invoiceDate = new Date(invoice.created_at);
        return (
          invoiceDate.getMonth() === lastMonth &&
          invoiceDate.getFullYear() === lastMonthYear &&
          invoice.status === status
        );
      })
      .reduce((sum, invoice) => sum + Number(invoice.total), 0);

    return numberFormatter.format(sum); // Tagastame vormindatud numbri
  };

  // Diagrammi andmete genereerimine
  const processMonthlyDataForCharts = (status: Invoice['status']): number[] => {
    const today = new Date();
    const lastSixMonths = Array.from(
      { length: 6 },
      (_, i) => (today.getMonth() - 5 + i + 12) % 12,
    );
    const months = Array(6).fill(0);

    invoiceDataForCharts.forEach((invoice) => {
      const date = new Date(invoice.created_at);
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Vigane kuupäev:', invoice.created_at);
        return;
      }

      const month = date.getMonth();
      const index = lastSixMonths.indexOf(month);
      if (index !== -1 && (status === '' || invoice.status === status)) {
        months[index] += Number(invoice.total);
      }
    });

    return months;
  };

  return (
    <div className='flex min-h-screen'>
      <div className='flex-1 bg-gray-50 p-6'>
        {/* Filter ja otsing */}
        <div className='mb-6 rounded-lg bg-gray-100 p-4 text-sm shadow'>
          {/* Ülemine rida - Flexboxiga sama rea peale */}
          <div className='flex items-center justify-between gap-4'>
            {/* Otsingukast koos dropdowniga */}
            <div className='relative w-[40rem]'>
              <input
                type='text'
                placeholder='Otsi arvet või klienti...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
              />

              {/* Otsingu tulemuste dropdown */}
              {searchQuery.length > 1 && (
                <div className='absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg'>
                  {isSearching ? (
                    <p className='p-3 text-gray-500'>Otsib...</p>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((invoice) => (
                      <div
                        key={invoice.id}
                        className='cursor-pointer px-4 py-2 hover:bg-gray-100'
                        onClick={() => router.push(`/invoice/${invoice.id}`)}
                      >
                        <p className='text-sm font-medium'>{invoice.client}</p>
                        <p className='text-xs text-gray-500'>
                          Arve #{invoice.id} – {invoice.total}€
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className='p-3 text-gray-500'>Tulemusi ei leitud</p>
                  )}
                </div>
              )}
            </div>

            {/* "Uus Arve" nupp lingiga */}

            <button
              onClick={() => router.push(`/new-invoice`)}
              className='whitespace-nowrap rounded-lg bg-blue-500 px-5 py-2 text-white shadow-md transition hover:bg-blue-600'
            >
              Uus Arve
            </button>
          </div>
        </div>
        <div className='mb-6 grid grid-cols-4 gap-6'>
          {invoiceStatusData.map(({ title, status, color }, index) => (
            <div key={index} className='rounded-lg bg-white p-6 shadow-lg'>
              <h3 className='text-xl font-semibold text-gray-700'>
                {processInvoiceData(status as Invoice['status'])}
              </h3>
              <p className='text-gray-500'>{title}</p>
              <div className='mt-4 h-40 w-full'>
                <Line
                  key={status}
                  data={generateChartData(
                    title,
                    processMonthlyDataForCharts(status as Invoice['status']),
                    color,
                  )}
                  options={chartOptions}
                />
              </div>
            </div>
          ))}
        </div>
        ;
        <div className='flex border-b border-gray-300'>
          <button
            className={`px-6 py-2 font-semibold ${activeTab === 'invoices' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('invoices')}
          >
            Viimased Arved
          </button>
          <button
            className={`px-6 py-2 font-semibold ${activeTab === 'clients' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('clients')}
          >
            Viimased Kliendid
          </button>
        </div>
        {/* Tabel vastavalt aktiivsele tab'ile */}
        <div className='rounded bg-white p-6 shadow-lg'>
          {activeTab === 'invoices' ? (
            <table className='w-full'>
              <thead>
                <tr className='border-b text-left'>
                  <th className='py-2 text-sm'>Tüüp</th>
                  <th className='py-2 text-sm'>Kuupäev</th>
                  <th className='py-2 text-sm'>Klient</th>
                  <th className='py-2 text-sm'>Staatus</th>
                  <th className='py-2 text-sm'>Kokku</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className='border-b'>
                    <td className='py-2' colSpan={5}>
                      Laadib...
                    </td>
                  </tr>
                ) : (
                  invoiceData.map((invoice) => (
                    <tr key={invoice.id} className='border-b'>
                      <td className='px-4 py-3 text-sm'>
                        {invoice.invoice_id}
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        {new Date(invoice.created_at).toLocaleDateString()}
                      </td>
                      <td className='py-2 text-sm'>
                        {invoice.company_name || 'N/A'}
                      </td>
                      <td className='py-2'>
                        {statusMap[invoice.status] || invoice.status}
                      </td>
                      <td className='py-2 text-sm'>${invoice.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className='w-full'>
              <thead>
                <tr className='border-b text-left'>
                  <th className='py-2 text-sm'>Nimi</th>
                  <th className='py-2 text-sm'>E-post</th>
                  <th className='py-2 text-sm'>Lisamise kuupäev</th>
                </tr>
              </thead>
              <tbody>
                {loadingClients ? (
                  <tr className='border-b'>
                    <td className='py-2 text-sm' colSpan={3}>
                      Laadib...
                    </td>
                  </tr>
                ) : (
                  clientData.map((client) => (
                    <tr key={client.id} className='border-b'>
                      <td className='py-2 text-sm'>{client.name}</td>
                      <td className='py-2 text-sm'>{client.email}</td>
                      <td className='py-2 text-sm'>
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
