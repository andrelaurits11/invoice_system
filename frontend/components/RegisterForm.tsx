import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const passwordRules = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const isEmailMatching = email === confirmEmail && email !== '';
  const isFormValid = name && isEmailMatching && isPasswordValid;

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          name,
          email,
          password,
        },
      );

      const token = response.data.token;
      login(token);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.',
        );
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8'>
        <div className='relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0'>
          <div className='mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left'>
            <form onSubmit={handleRegister}>
              <h2 className='mb-4 text-2xl font-bold text-stone-50'>
                Register
              </h2>
              <input
                type='text'
                placeholder='Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='mb-3 w-full rounded border p-2'
              />
              <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mb-3 w-full rounded border p-2'
              />
              <input
                type='email'
                placeholder='Confirm Email'
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                required
                className={`mb-3 w-full rounded border p-2 ${isEmailMatching ? 'border-green-500' : 'border-red-500'}`}
              />
              <input
                type='password'
                placeholder='Password'
                value={password}
                onFocus={() => setShowPasswordRules(true)}
                onBlur={() => setShowPasswordRules(password !== '')}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mb-3 w-full rounded border p-2'
              />
              {showPasswordRules && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='rounded-md bg-gray-800 p-3 text-sm text-white shadow-md'
                >
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
                        passwordRules.uppercase
                          ? 'text-green-400'
                          : 'text-red-400'
                      }
                    >
                      Vähemalt 1 suurtäht
                    </li>
                    <li
                      className={
                        passwordRules.lowercase
                          ? 'text-green-400'
                          : 'text-red-400'
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
                </motion.div>
              )}
              <button
                type='submit'
                disabled={!isFormValid}
                className={`mb-3 w-full rounded p-2 text-white ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'cursor-not-allowed bg-gray-400'}`}
              >
                Register
              </button>
              {error && <p className='text-red-500'>{error}</p>}
              <p className='text-stone-50'>
                Already have an account?{' '}
                <Link
                  href='/login'
                  className='text-blue-500 hover:text-blue-300'
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
          <div className='relative mb-4 mt-16 h-80 lg:mt-8'>
            <Image
              alt='App screenshot'
              src='/cover.png'
              width={1824}
              height={1080}
              className='absolute left-0 top-20 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
