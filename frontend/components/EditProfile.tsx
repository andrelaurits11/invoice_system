import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUpload } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

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
  logo_picture?: string | null;
}

const ProfilePage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
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
    logo_picture: null,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch user data.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return alert('Palun vali fail!');

    setUploading(true);
    const formData = new FormData();
    formData.append('logo_picture', selectedFile);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/profile/upload-logo',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setProfile(
        (prevProfile) =>
          prevProfile && {
            ...prevProfile,
            logo_picture: response.data.logo_picture,
          },
      );
      setSelectedFile(null);
      alert('Pilt edukalt üles laaditud!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Pilti ei õnnestunud üles laadida.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (field: string) => {
    setEditing(field);
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
              <div
                key={field}
                className='mb-4 flex items-center justify-between'
              >
                {!editing || editing !== field ? (
                  <p className='font-semibold'>
                    {field === 'businessname'
                      ? 'Ärinimi'
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                    : {profile[field as keyof UserProfile]}
                  </p>
                ) : (
                  <input
                    type='text'
                    name={field}
                    value={formData[field as keyof UserProfile] as string}
                    onChange={handleChange}
                    className='w-full rounded border px-4 py-2'
                  />
                )}
                <button
                  onClick={() => handleEdit(field)}
                  className='text-blue-500'
                >
                  <FontAwesomeIcon icon={faEdit} className='h-5 w-5' />
                </button>
              </div>
            ))}

            {/* Profiilipilt ja üleslaadimise funktsionaalsus */}
            <div className='mt-6'>
              {profile.logo_picture && (
                <Image
                  src={`http://localhost:8000/storage/${profile.logo_picture}`}
                  alt='Logo'
                  width={128}
                  height={128}
                  className='rounded-full object-cover'
                />
              )}
              <input
                type='file'
                onChange={handleFileChange}
                className='mt-4 w-full'
              />
              <button
                onClick={handleFileUpload}
                disabled={uploading}
                className='mt-2 flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white'
              >
                <FontAwesomeIcon icon={faUpload} className='mr-2' />
                {uploading ? 'Laadin üles...' : 'Laadi uus pilt'}
              </button>
            </div>
          </div>
        ) : (
          <p>Laadin profiili andmeid...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
