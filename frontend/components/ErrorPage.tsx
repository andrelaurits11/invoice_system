import React from 'react';
import Link from 'next/link';

const ErrorPage = ({
  statusCode,
  message,
}: {
  statusCode: number;
  message: string;
}) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-6'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md'>
        <h1 className='text-4xl font-bold text-gray-700'>{statusCode}</h1>
        <p className='mt-2 text-lg text-gray-500'>{message}</p>
        <Link href='/'>
          <span className='mt-6 inline-block cursor-pointer rounded-lg bg-blue-500 px-5 py-2 text-white shadow-md transition hover:bg-blue-600'>
            Tagasi avalehele
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
