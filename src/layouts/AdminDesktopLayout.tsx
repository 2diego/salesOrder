import { useLocation } from 'react-router-dom';
import Sidebar from '../components/desktop/Sidebar/Sidebar';
import HeaderDesktop from '../components/desktop/Header/HeaderDesktop';
import OrdersDesktop from '../pages/Admin/desktop/Orders/OrdersDesktop';
import ValidateOrderDesktop from '../pages/Admin/desktop/Orders/ValidateOrderDesktop';
import './AdminDesktopLayout.css';
import ClientsDesktop from '../pages/Admin/desktop/Clients/ClientsDesktop';
import ProductsDesktop from '../pages/Admin/desktop/Products/ProductsDesktop';
import SellersDesktop from '../pages/Admin/desktop/Sellers/SellersDesktop';
import ProfileDesktop from '../pages/Admin/desktop/Profile/ProfileDesktop';

const AdminDesktopLayout = () => {
  const location = useLocation();
  
  const renderPage = () => {
    if (location.pathname.startsWith('/ValidateOrder/')) {
      return <ValidateOrderDesktop />;
    }
    switch (location.pathname) {
      case '/Orders':
        return <OrdersDesktop />;
      case '/Manage/AdminClients':
        return <ClientsDesktop />;
      case '/Manage/AdminProducts':
        return <ProductsDesktop />;
      case '/Manage/AdminSellers':
        return <SellersDesktop />;
      case '/Profile':
        return <ProfileDesktop />;
      default:
        return <OrdersDesktop />; // Valor por defecto para Orders
    }
  };

  return (
    <div className="admin-desktop-layout">
      <Sidebar />
      <HeaderDesktop />
      <div className="admin-content">
        <main className="admin-main">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default AdminDesktopLayout;