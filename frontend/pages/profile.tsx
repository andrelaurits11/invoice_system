import LayoutMain from '@/components/LayoutMain';
import EditProfile from '../components/EditProfile';
import { useAuth } from '@/context/AuthContext';

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Ei renderda midagi, kui kasutaja pole autentitud
  }

  return (
    <LayoutMain>
      <EditProfile />
    </LayoutMain>
  );
};

export default ProfilePage;
