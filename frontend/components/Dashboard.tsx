import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Lisame autentimise konteksti
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js moodulid
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Dashboard = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const lineChartData = {
    labels: ['Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni'],
    datasets: [
      {
        label: 'Summad',
        data: [200, 400, 300, 500, 700, 600],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  // Andmed tulpdiagrammi jaoks
  const barChartData = {
    labels: ['Jaanuar', 'Veebruar', 'Märts', 'Aprill', 'Mai', 'Juuni'],
    datasets: [
      {
        label: 'Summad',
        data: [100, 300, 200, 400, 500, 450],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='flex h-screen'>
      {/* Külgriba */}
      <div className='w-1/5 bg-gray-100 p-6'>
        <h2 className='mb-6 text-xl font-bold'>Töölaud</h2>
        <nav className='flex flex-col space-y-4'>
          <button
            onClick={() => router.push('/')}
            className='font-semibold text-blue-500'
          >
            Töölaud
          </button>
          <button
            onClick={() => router.push('/invoices')}
            className='text-gray-600'
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

      {/* Peamine sisu */}
      <div className='flex-1 bg-gray-50 p-6'>
        {/* Päis */}
        <div className='mb-6 flex items-center justify-between'>
          <input
            type='text'
            placeholder='Otsi...'
            className='w-1/3 rounded border border-gray-300 p-2'
          />
          <button className='rounded bg-blue-500 px-4 py-2 text-white'>
            Uus Arve
          </button>
        </div>

        {/* Statistika kaardid */}
        <div className='mb-6 grid grid-cols-4 gap-6'>
          <div className='rounded border border-gray-200 bg-white p-4 text-center shadow'>
            <h3 className='mb-4 text-gray-500'>Maksmata summad</h3>
            <div className='h-60 w-full'>
              <Line
                data={lineChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className='rounded border border-gray-200 bg-white p-4 text-center shadow'>
            <h3 className='mb-4 text-gray-500'>Võlgnevused</h3>
            <div className='h-60 w-full'>
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className='rounded border border-gray-200 bg-white p-4 text-center shadow'>
            <h3 className='mb-4 text-gray-500'>Makstud summad</h3>
            <div className='h-60 w-full'>
              <Line
                data={lineChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className='rounded border border-gray-200 bg-white p-4 text-center shadow'>
            <h3 className='mb-4 text-gray-500'>Arve summad</h3>
            <div className='h-60 w-full'>
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Tab'id */}
        <div className='mb-6 flex border-b border-gray-300'>
          <button className='border-b-2 border-blue-500 px-6 py-2 font-semibold text-blue-500'>
            Viimased Arved
          </button>
          <button className='px-6 py-2 font-semibold text-gray-500'>
            Viimased Kliendid
          </button>
        </div>

        {/* Tabel */}
        <div className='rounded bg-white p-6 shadow'>
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
              <tr className='border-b'>
                <td className='py-2'>Laadib...</td>
                <td className='py-2'>Laadib...</td>
                <td className='py-2'>Laadib...</td>
                <td className='py-2'>
                  <span className='rounded bg-gray-300 px-3 py-1 text-white'>
                    Laadib...
                  </span>
                </td>
                <td className='py-2'>Laadib...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
