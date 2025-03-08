import { useRouter } from 'next/router';
import PasswordChange from '@/components/PasswordChange';

const PasswordResetPage = () => {
  const router = useRouter();
  const { token, email } = router.query; // Token ja email URL-ist

  if (!router.isReady) {
    return <p>Loading...</p>;
  }

  if (!token || !email) {
    return <p>Invalid password reset link.</p>;
  }

  return <PasswordChange />;
};

export default PasswordResetPage;
