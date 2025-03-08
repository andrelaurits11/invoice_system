import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const PasswordChange = () => {
  const router = useRouter();
  const { token, email } = router.query; // Token ja email URL-ist

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const passwordRules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // 🔹 Kontrollime, kas token on olemas
    if (!token || !email) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (!isPasswordValid) {
      setError('Parool ei vastu turvalisuse nõuetele.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      setMessage(
        'Parool on edukalt lähtestatud. Sisselogimise ümbersuunamine...',
      );
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || 'Parooli lähtestamine ebaõnnestus.',
        );
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-center text-2xl font-bold text-gray-700'>
          Lähtesta Parool
        </h2>
        <form onSubmit={handleResetPassword}>
          <input
            type='email'
            placeholder='Sinu Email'
            value={email ? String(email) : ''}
            readOnly
            className='mb-3 w-full rounded border bg-gray-200 p-2'
          />
          <input
            type='password'
            placeholder='Uus Parool'
            value={password}
            onFocus={() => setShowPasswordRules(true)}
            onBlur={() => setShowPasswordRules(password !== '')}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='mb-3 w-full rounded border p-2'
          />
          {showPasswordRules && (
            <div className='rounded-md bg-gray-800 p-3 text-sm text-white shadow-md'>
              <ul>
                <li
                  className={
                    passwordRules.length ? 'text-green-400' : 'text-red-400'
                  }
                >
                  Vähemalt 12 tähemärki
                </li>
                <li
                  className={
                    passwordRules.uppercase ? 'text-green-400' : 'text-red-400'
                  }
                >
                  Vähemalt 1 suurtäht
                </li>
                <li
                  className={
                    passwordRules.lowercase ? 'text-green-400' : 'text-red-400'
                  }
                >
                  Vähemalt 1 väiketäht
                </li>
                <li
                  className={
                    passwordRules.number ? 'text-green-400' : 'text-red-400'
                  }
                >
                  Vähemalt 1 number
                </li>
                <li
                  className={
                    passwordRules.symbol ? 'text-green-400' : 'text-red-400'
                  }
                >
                  Vähemalt 1 sümbol
                </li>
              </ul>
            </div>
          )}
          <input
            type='password'
            placeholder='Korrake Parooli'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='mb-3 w-full rounded border p-2'
          />
          <button
            type='submit'
            disabled={!isPasswordValid}
            className={`mb-3 w-full rounded p-2 text-white ${isPasswordValid ? 'bg-blue-500 hover:bg-blue-600' : 'cursor-not-allowed bg-gray-400'}`}
          >
            Lähtesta Parool
          </button>
          {message && <p className='text-green-500'>{message}</p>}
          {error && <p className='text-red-500'>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;
