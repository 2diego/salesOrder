import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Orders from './pages/Admin/mobile/Orders/Orders';
import Reports from './pages/Admin/mobile/Reports/Reports';
import Manage from './pages/Admin/mobile/Manage/Manage';
import Profile from './pages/Admin/mobile/Profile/Profile';
import NewOrder from './pages/Customer/mobile/NewOrder';
import AdminLayout from './layouts/AdminLayout';
import OrderHistory from './pages/Admin/mobile/Manage/OrderHistory';
import Cart from './pages/Customer/mobile/Cart';
import AdminSellers from './pages/Admin/mobile/Manage/Sellers/AdminSellers';
import AdminProducts from './pages/Admin/mobile/Manage/Products/AdminProducts';
import AdminClients from './pages/Admin/mobile/Manage/Clients/AdminClients';
import CustomerOrderHistory from './pages/Customer/mobile/CustomerOrderHistory';
import HistoryOrderDetails from './pages/Customer/mobile/HistoryOrderDetails';
import ClientsList from './pages/Admin/mobile/Manage/Clients/ClientsList';
import ProductsList from './pages/Admin/mobile/Manage/Products/ProductsList';
import SellersList from './pages/Admin/mobile/Manage/Sellers/SellersList';
import AddClients from './pages/Admin/mobile/Manage/Clients/AddClients';
import AddProducts from './pages/Admin/mobile/Manage/Products/AddProducts';
import AddSellers from './pages/Admin/mobile/Manage/Sellers/AddSellers';
import EditClients from './pages/Admin/mobile/Manage/Clients/EditClients';
import EditProducts from './pages/Admin/mobile/Manage/Products/EditProducts';
import EditSellers from './pages/Admin/mobile/Manage/Sellers/EditSellers';
import CreateLink from './pages/Admin/mobile/Orders/CreateLink';
import ValidateOrder from './pages/Admin/mobile/Orders/ValidateOrder';
import EditPassword from './pages/Admin/mobile/Profile/EditPassword';
import EditProfile from './pages/Admin/mobile/Profile/EditProfile';
import { useIsDesktop } from './hooks/useIsDesktop';
import CustomerDesktop from './pages/Customer/desktop/CustomerDesktop';

const NewOrderRoute = () => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <CustomerDesktop /> : <NewOrder />;
};

const CartRoute = () => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <CustomerDesktop /> : <Cart />;
};

const CustomerOrderHistoryRoute = () => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <CustomerDesktop /> : <CustomerOrderHistory />;
};

const HistoryOrderDetailsRoute = () => {
  const isDesktop = useIsDesktop();
  return isDesktop ? <CustomerDesktop /> : <HistoryOrderDetails />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,  
    children: [
      {
        path: "/",
        element: <Navigate to ="/Orders" replace />,
      },
      {
        path: "/Orders",
        element: <Orders />
      },
      {
        path: "/CreateLink",
        element: <CreateLink />
      },
      {
        path: "/ValidateOrder/:id",
        element: <ValidateOrder />
      },
      {
        path: "/Reports",
        element: <Reports />
      },
      {
        path: "/Manage",
        element: <Manage />,
      },
      {
        path: "/Profile",
        element: <Profile />
      },
      {
        path: "/Profile/EditProfile",
        element: <EditProfile />
      },
      {
        path: "/Profile/EditPassword",
        element: <EditPassword />
      },
      {
        path: "/OrderHistory",
        element: <OrderHistory />
      },
      {
        path: "/Manage/AdminSellers",
        element: <AdminSellers />
      },
      {
        path: "/Manage/AdminProducts",
        element: <AdminProducts />
      },
      {
        path: "/Manage/AdminClients",
        element: <AdminClients />
      },
      {
        path: "/Manage/ClientsList",
        element: <ClientsList />
      },
      {
        path: "/Manage/ProductsList",
        element: <ProductsList />
      },
      {
        path: "/Manage/SellersList",
        element: <SellersList />
      },
      {
        path: "/Manage/AddClients",
        element: <AddClients />
      },
      {
        path: "/Manage/AddProducts",
        element: <AddProducts />
      },
      {
        path: "/Manage/AddSellers",
        element: <AddSellers />
      },
      {
        path: "/Manage/EditClient/:id",
        element: <EditClients />
      },
      {
        path: "/Manage/EditProduct/:id",
        element: <EditProducts />
      },
      {
        path: "/Manage/EditSeller/:id",
        element: <EditSellers />
      }
    ]
  },
  {
    path: "/NewOrder",
    element: <NewOrderRoute />
  },
  {
    path: "/Cart",
    element: <CartRoute />
  },
  {
    path: "/CustomerOrderHistory",
    element: <CustomerOrderHistoryRoute />
  },
  {
    path: "/HistoryOrderDetails/:id",
    element: <HistoryOrderDetailsRoute />
  }
]);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
