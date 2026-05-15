import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import './Sidebar.css';
import {
  LuClipboardList,
  LuUsers,
  LuBox,
  LuUserCog,
  LuUser,
  LuLogOut,
} from 'react-icons/lu';
import { useLogoutConfirm } from '../../../hooks/useLogoutConfirm';
import type { SidebarNavItem } from './SidebarItem';

const menuItems: SidebarNavItem[] = [
  {
    id: 'orders',
    label: 'Pedidos',
    icon: LuClipboardList,
    path: '/Orders',
  },
  {
    id: 'clients',
    label: 'Clientes',
    icon: LuUsers,
    path: '/Manage/AdminClients',
  },
  {
    id: 'products',
    label: 'Productos',
    icon: LuBox,
    path: '/Manage/AdminProducts',
  },
  {
    id: 'sellers',
    label: 'Vendedores',
    icon: LuUserCog,
    path: '/Manage/AdminSellers',
  },
  {
    id: 'profile',
    label: 'Perfil',
    icon: LuUser,
    path: '/Profile',
  },
  {
    id: 'logout',
    label: 'Cerrar sesión',
    icon: LuLogOut,
    path: '',
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { requestLogout, logoutDialog } = useLogoutConfirm({
    variant: 'desktop',
    onConfirmed: () => navigate('/login', { replace: true }),
  });

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>

        <div className="sidebar-header-line" />

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={item.path !== '' && location.pathname === item.path}
              onLogoutClick={item.id === 'logout' ? requestLogout : undefined}
            />
          ))}
        </nav>
      </div>
      {logoutDialog}
    </>
  );
};

export default Sidebar;
