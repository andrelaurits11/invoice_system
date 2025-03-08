import axios from 'axios';
import { useState } from 'react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        email,
      });
      setMessage(
        'Parooli lähtestamise link on saadetud teie e-posti aadressile',
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Request failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-center text-2xl font-bold text-gray-700'>
          Unustasid Parooli
        </h2>
        <form onSubmit={handleRequestReset}>
          <input
            type='email'
            placeholder='Sisesta email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='mb-3 w-full rounded border p-2'
          />
          <button
            type='submit'
            className='mb-3 w-full rounded bg-blue-500 p-2 text-white'
          >
            Saada uus parool
          </button>
          {message && <p className='text-green-500'>{message}</p>}
          {error && <p className='text-red-500'>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
