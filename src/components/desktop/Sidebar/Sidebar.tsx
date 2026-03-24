import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import './Sidebar.css';
import { 
  LuClipboardList, 
  LuUsers, 
  LuBox, 
  LuUserCog, 
  LuUser,
  LuLogOut 
} from "react-icons/lu";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
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
  }/*,
  {
    id: 'reports',
    label: 'Reportes',
    icon: LuFileChartColumnIncreasing,
    path: '/Reports',
  }*/,
  {
    id: 'logout',
    label: 'Cerrar Sesión',
    icon: LuLogOut,
    path: '',
  },
];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <div className="sidebar-header-line" />
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;