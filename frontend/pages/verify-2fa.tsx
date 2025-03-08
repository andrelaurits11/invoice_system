import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Lock, ShieldCheck } from 'lucide-react';

const Verify2FA = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { email } = router.query;

  useEffect(() => {
    if (!email) {
      router.push('/'); // Kui ei ole emaili, suuna tagasi kodule
    }
  }, [email, router]);

  const handleVerify2FA = async () => {
    if (email && verificationCode) {
      try {
        const cleanedCode = verificationCode.replace(/\s+/g, ''); // Eemaldame kõik tühikud

        const response = await axios.post(
          'http://localhost:8000/api/verify-2fa',
          { code: cleanedCode, email },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        // Kui kood on õige, salvestame tagastatud tokeni localStorage'i
        localStorage.setItem('authToken', response.data.token);

        alert('2FA edukalt kinnitatud!');
        router.push('/'); // Suuna koju pärast edukat 2FA kinnitamist
      } catch (error) {
        console.error('Error verifying 2FA:', error);
        setError('Vale kood');
      }
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <div className='mb-4 flex items-center justify-center'>
          <ShieldCheck className='h-12 w-12 text-blue-500' />
        </div>
        <h2 className='mb-4 text-center text-xl font-semibold text-gray-700'>
          Kaheastmeline Autentimine
        </h2>
        <p className='mb-6 text-center text-gray-500'>
          Sisesta oma 2FA-kood, et jätkata
        </p>

        <div className='relative mb-4'>
          <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Sisesta 2FA kood'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className='w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300'
          />
        </div>

        {error && <p className='mb-4 text-center text-red-500'>{error}</p>}

        <button
          onClick={handleVerify2FA}
          className='w-full rounded-lg bg-blue-500 px-5 py-2 text-white shadow-md transition hover:bg-blue-600'
        >
          Kontrolli kood
        </button>
      </div>
    </div>
  );
};

export default Verify2FA;
