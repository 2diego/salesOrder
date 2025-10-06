import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav/BottomNav';
import { useMediaQuery } from 'react-responsive';
import AdminDesktopLayout from './AdminDesktopLayout';

const AdminLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  
  if (!isMobile) {
    return <AdminDesktopLayout />;
  }
  
  return (
    <div>
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default AdminLayout;
