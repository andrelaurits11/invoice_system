import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

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
    <div className='bg-white'>
      <h1>2FA Kood</h1>
      <input
        type='text'
        placeholder='Sisesta 2FA kood'
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerify2FA}>Kontrolli kood</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Verify2FA;
