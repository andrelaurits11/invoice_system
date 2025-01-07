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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

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
    <div className="flex h-screen">
      {/* Külgriba */}
      <div className="bg-gray-100 w-1/5 p-6">
        <h2 className="text-xl font-bold mb-6">Töölaud</h2>
        <nav className="flex flex-col space-y-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 font-semibold"
          >
            Töölaud
          </button>
          <button
            onClick={() => router.push('/invoices')}
            className="text-gray-600"
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

      {/* Peamine sisu */}
      <div className="flex-1 bg-gray-50 p-6">
        {/* Päis */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Otsi..."
            className="w-1/3 p-2 border border-gray-300 rounded"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Uus Arve
          </button>
        </div>

        {/* Statistika kaardid */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="p-4 bg-white shadow rounded text-center border border-gray-200">
            <h3 className="text-gray-500 mb-4">Maksmata summad</h3>
            <div className="h-60 w-full">
              <Line
                data={lineChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="p-4 bg-white shadow rounded text-center border border-gray-200">
            <h3 className="text-gray-500 mb-4">Võlgnevused</h3>
            <div className="h-60 w-full">
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="p-4 bg-white shadow rounded text-center border border-gray-200">
            <h3 className="text-gray-500 mb-4">Makstud summad</h3>
            <div className="h-60 w-full">
              <Line
                data={lineChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="p-4 bg-white shadow rounded text-center border border-gray-200">
            <h3 className="text-gray-500 mb-4">Arve summad</h3>
            <div className="h-60 w-full">
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Tab'id */}
        <div className="flex border-b border-gray-300 mb-6">
          <button className="px-6 py-2 font-semibold text-blue-500 border-b-2 border-blue-500">
            Viimased Arved
          </button>
          <button className="px-6 py-2 font-semibold text-gray-500">
            Viimased Kliendid
          </button>
        </div>

        {/* Tabel */}
        <div className="bg-white shadow rounded p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Tüüp</th>
                <th className="py-2">Kuupäev</th>
                <th className="py-2">Klient</th>
                <th className="py-2">Staatus</th>
                <th className="py-2">Kokku</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Laadib...</td>
                <td className="py-2">Laadib...</td>
                <td className="py-2">Laadib...</td>
                <td className="py-2">
                  <span className="px-3 py-1 text-white rounded bg-gray-300">
                    Laadib...
                  </span>
                </td>
                <td className="py-2">Laadib...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
