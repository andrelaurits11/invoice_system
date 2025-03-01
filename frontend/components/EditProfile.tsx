import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'; // Impordime "edit" ikooni

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  address2: string;
  state: string;
  zip: string;
  country: string;
  businessname: string;
  city: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState<string | null>(null); // Hoidke ainult redigeeritava välja nime
  const [formData, setFormData] = useState<UserProfile>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    state: '',
    zip: '',
    country: '',
    businessname: '',
    city: '',
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setProfile(response.data);
      setFormData(response.data); // Täidame vormi andmed saadud profiiliga
    } catch (error) {
      alert('Failed to fetch user data.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        'http://localhost:8000/api/profile', // API endpoint profiili muutmiseks
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      );
      setProfile(response.data);
      setEditing(null); // Peatame redigeerimise pärast salvestamist
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  const handleEdit = (field: string) => {
    setEditing(field); // Määrame, millist välja muuta
  };

  const handleCancel = () => {
    setEditing(null); // Tühistame redigeerimise
  };

  return (
    <div className='flex h-screen'>
      <div className='w-1/5 bg-gray-100 p-6'>
        <h2 className='mb-6 text-xl font-bold'>Kliendid</h2>
        <nav className='flex flex-col space-y-4'>
          <button onClick={() => router.push('/')} className='text-gray-600'>
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
            className='font-semibold text-blue-500'
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

      <div className='flex-1 p-8'>
        <h1 className='mb-4 text-2xl font-bold'>Minu profiil</h1>
        {profile ? (
          <div className='rounded border p-6 shadow'>
            {[
              'name',
              'email',
              'phone',
              'address',
              'country',
              'state',
              'zip',
              'businessname',
              'city',
            ].map((field) => (
              <div key={field} className='flex items-center justify-between'>
                {!editing || editing !== field ? (
                  <p className='font-semibold'>
                    {field === 'businessname'
                      ? 'Ärinimi'
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                    :{profile[field as keyof UserProfile]}
                  </p>
                ) : (
                  <div className='mb-4'>
                    <label className='block font-semibold'>
                      {field === 'businessname'
                        ? 'Ärinimi'
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type='text'
                      name={field}
                      value={formData[field as keyof UserProfile]}
                      onChange={handleChange}
                      className='w-full rounded border px-4 py-2'
                    />
                  </div>
                )}
                <button
                  onClick={() => handleEdit(field)}
                  className='text-blue-500'
                >
                  <FontAwesomeIcon icon={faEdit} className='h-5 w-5' />
                </button>
              </div>
            ))}
            {editing && (
              <div>
                <button
                  className='mt-4 rounded bg-green-500 px-4 py-2 text-white'
                  onClick={handleSave}
                >
                  Salvesta
                </button>
                <button
                  className='ml-4 mt-4 rounded bg-gray-500 px-4 py-2 text-white'
                  onClick={handleCancel}
                >
                  Tühista
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Laadin profiili andmeid...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
