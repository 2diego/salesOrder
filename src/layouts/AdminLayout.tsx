import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav/BottomNav';

const AdminLayout = () => {
  return (
    <div>
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default AdminLayout;
