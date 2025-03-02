import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
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
  id: number;
  type: string;
  created_at: string;
  date: string;
  client: string;
  status: 'osaliselt_makstud' | 'makse_ootel' | 'ootel' | 'makstud';
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
  const router = useRouter();
  const { logout } = useAuth();
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [clientData, setClientData] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'invoices' | 'clients'>(
    'invoices',
  );

  useEffect(() => {
    const fetchInvoices = async () => {
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
        console.error('❌ Viga arvete laadimisel:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
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

  const processInvoiceData = (status: Invoice['status']): number => {
    return invoiceData
      .filter((invoice) => invoice.status === status)
      .reduce((sum, invoice) => sum + Number(invoice.total), 0);
  };

  const processMonthlyData = (status: Invoice['status']): number[] => {
    const today = new Date();
    const lastSixMonths = Array.from(
      { length: 6 },
      (_, i) => (today.getMonth() - 5 + i + 12) % 12,
    );
    const months = Array(6).fill(0);

    invoiceData.forEach((invoice) => {
      const date = new Date(invoice.created_at);
      if (isNaN(date.getTime())) {
        console.warn('⚠️ Vigane kuupäev:', invoice.created_at);
        return;
      }

      const month = date.getMonth();
      const index = lastSixMonths.indexOf(month);
      if (index !== -1 && invoice.status === status) {
        months[index] += Number(invoice.total);
      }
    });

    return months;
  };

  return (
    <div className='flex h-screen'>
      <div className='w-1/5 bg-gray-900 p-6 text-white'>
        <h2 className='mb-6 text-xl font-bold'>Töölaud</h2>
        <nav className='flex flex-col space-y-4'>
          <button onClick={() => router.push('/')} className='text-blue-300'>
            Töölaud
          </button>
          <button
            onClick={() => router.push('/invoices')}
            className='text-gray-300'
          >
            Arved
          </button>
          <button
            onClick={() => router.push('/clients')}
            className='text-gray-300'
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
            className='w-1/3 rounded border border-gray-300 p-2 shadow'
          />
          <button className='rounded bg-blue-600 px-4 py-2 text-white shadow-md'>
            Uus Arve
          </button>
        </div>
        <div className='mb-6 grid grid-cols-4 gap-6'>
          {[
            [
              'Osaliselt makstud',
              'osaliselt_makstud',
              'rgba(100, 100, 100, 0.7)',
            ],
            ['Makse ootel', 'makse_ootel', 'rgba(200, 0, 0, 0.7)'],
            ['Ootel', 'ootel', 'rgba(0, 123, 255, 1)'],
            ['Makstud', 'makstud', 'rgba(0, 200, 0, 0.7)'],
          ].map(([title, status, color], index) => (
            <div key={index} className='rounded-lg bg-white p-6 shadow-lg'>
              <h3 className='text-xl font-semibold text-gray-700'>
                ${processInvoiceData(status as Invoice['status']).toFixed(2)}
              </h3>
              <p className='text-gray-500'>{title}</p>
              <div className='mt-4 h-40 w-full'>
                <Line
                  key={status}
                  data={generateChartData(
                    title as string,
                    processMonthlyData(status as Invoice['status']),
                    color as string,
                  )}
                  options={chartOptions}
                />
              </div>
            </div>
          ))}
        </div>

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
                  <th className='py-2'>Tüüp</th>
                  <th className='py-2'>Kuupäev</th>
                  <th className='py-2'>Klient</th>
                  <th className='py-2'>Staatus</th>
                  <th className='py-2'>Kokku</th>
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
                      <td className='py-2'>{invoice.type}</td>
                      <td className='py-2'>{invoice.date}</td>
                      <td className='py-2'>{invoice.client}</td>
                      <td className='py-2'>{invoice.status}</td>
                      <td className='py-2'>${invoice.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className='w-full'>
              <thead>
                <tr className='border-b text-left'>
                  <th className='py-2'>Nimi</th>
                  <th className='py-2'>E-post</th>
                  <th className='py-2'>Lisamise kuupäev</th>
                </tr>
              </thead>
              <tbody>
                {loadingClients ? (
                  <tr className='border-b'>
                    <td className='py-2' colSpan={3}>
                      Laadib...
                    </td>
                  </tr>
                ) : (
                  clientData.map((client) => (
                    <tr key={client.id} className='border-b'>
                      <td className='py-2'>{client.name}</td>
                      <td className='py-2'>{client.email}</td>
                      <td className='py-2'>
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
