import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  const handleSave = async () => {
    try {
      const updateData = new FormData();

      // Lisa ainult muudetav väli
      if (editing && formData[editing as keyof UserProfile] !== undefined) {
        updateData.append(
          editing,
          formData[editing as keyof UserProfile] as string,
        );
      }

      const response = await axios.post(
        'http://localhost:8000/api/profile',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setProfile(response.data.user); // Uuenda profiili andmeid
      setEditing(null); // Peida sisestusväli
      alert('Profiil edukalt uuendatud!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Profiili uuendamine ebaõnnestus.');
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-6'>
      <div className='w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg'>
        <h1 className='mb-6 text-center text-3xl font-bold'>Minu profiil</h1>

        {profile ? (
          <div className='grid gap-6 md:grid-cols-3'>
            {/* Vasak pool: Profiilipilt ja põhiinfo */}
            <div className='flex flex-col items-center rounded-lg bg-gray-50 p-6 shadow-sm'>
              <div
                className='group relative cursor-pointer'
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                {profile.logo_picture ? (
                  <Image
                    src={`http://localhost:8000/storage/${profile.logo_picture}`}
                    alt='Profile Picture'
                    width={250}
                    height={250}
                    className='rounded-full border border-gray-300 object-cover transition-opacity duration-300 group-hover:opacity-50'
                  />
                ) : (
                  <div className='flex h-32 w-32 items-center justify-center rounded-full border border-gray-300 bg-gray-200 text-gray-600'>
                    Profiilipilt puudub
                  </div>
                )}

                {/* Hoveril nähtav tekst */}
                <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                  <span className='font-semibold text-white'>Uuenda pilti</span>
                </div>
              </div>

              {/* Peidetud failivalija */}
              <input
                type='file'
                id='fileInput'
                onChange={handleFileChange}
                className='hidden'
              />

              {/* Laadi üles nupp */}
              {selectedFile && (
                <button
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className='mt-4 flex w-full items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white shadow transition hover:bg-blue-600'
                >
                  <FontAwesomeIcon icon={faUpload} className='mr-2' />
                  {uploading ? 'Laadin üles...' : 'Laadi uus pilt'}
                </button>
              )}

              {/* Ärinimi, email, telefon */}
              <div className='mt-4 text-center'>
                <h2 className='text-xl font-semibold'>
                  {profile.businessname}
                </h2>
                <p className='text-gray-600'>{profile.email}</p>
                <p className='text-gray-600'>{profile.phone}</p>
              </div>
            </div>

            {/* Parem pool: Profiili andmed kahes veerus */}
            <div className='col-span-2 rounded-lg bg-gray-50 p-6 shadow-sm'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {[
                  'businessname',
                  'email',
                  'phone',
                  'address',
                  'country',
                  'state',
                  'zip',
                  'city',
                ].map((field) => (
                  <div key={field} className='relative flex flex-col'>
                    <label className='block text-sm font-medium text-gray-600'>
                      {field === 'businessname'
                        ? 'Ärinimi'
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>

                    {!editing || editing !== field ? (
                      <p className='mt-1 text-gray-800'>
                        {profile[field as keyof UserProfile]}
                      </p>
                    ) : (
                      <input
                        type='text'
                        name={field}
                        value={formData[field as keyof UserProfile] as string}
                        onChange={handleChange}
                        className='mt-1 w-full rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                      />
                    )}

                    {/* Edit ikoon paremal */}
                    <button
                      onClick={() => handleEdit(field)}
                      className='absolute right-0 top-0 text-blue-500'
                    >
                      <FontAwesomeIcon icon={faEdit} className='h-4 w-4' />
                    </button>

                    {editing === field && (
                      <button
                        onClick={handleSave}
                        className='mt-2 w-full rounded-lg bg-blue-500 px-4 py-2 text-white shadow transition hover:bg-blue-600'
                      >
                        Salvesta muudatused
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className='text-center text-gray-600'>
            Laadin profiili andmeid...
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
