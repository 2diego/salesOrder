import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Orders from './pages/Admin/Orders/Orders';
import Reports from './pages/Admin/Reports/Reports';
import Manage from './pages/Admin/Manage/Manage';
import Profile from './pages/Admin/Profile/Profile';
import NewOrder from './pages/Customer/NewOrder';
import Adminlayout from './layouts/AdminLayout';
import OrderHistory from './pages/Admin/Manage/OrderHistory';
import Cart from './pages/Customer/Cart';
import AdminSellers from './pages/Admin/Manage/Sellers/AdminSellers';
import AdminProducts from './pages/Admin/Manage/Products/AdminProducts';
import AdminClients from './pages/Admin/Manage/Clients/AdminClients';
import CustomerOrderHistory from './pages/Customer/CustomerOrderHistory';
import HistoryOrderDetails from './pages/Customer/HistoryOrderDetails';
import ClientsList from './pages/Admin/Manage/Clients/ClientsList';
import ProductsList from './pages/Admin/Manage/Products/ProductsList';
import SellersList from './pages/Admin/Manage/Sellers/SellersList';
import AddClients from './pages/Admin/Manage/Clients/AddClients';
import AddProducts from './pages/Admin/Manage/Products/AddProducts';
import AddSellers from './pages/Admin/Manage/Sellers/AddSellers';
import EditClients from './pages/Admin/Manage/Clients/EditClients';
import EditProducts from './pages/Admin/Manage/Products/EditProducts';
import EditSellers from './pages/Admin/Manage/Sellers/EditSellers';
import CreateLink from './pages/Admin/Orders/CreateLink';
import ValidateOrder from './pages/Admin/Orders/ValidateOrder';
import EditPassword from './pages/Admin/Profile/EditPassword';
import EditProfile from './pages/Admin/Profile/EditProfile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Adminlayout />,  
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
    element: <NewOrder />
  },
  {
    path: "/Cart",
    element: <Cart />
  },
  {
    path: "/CustomerOrderHistory",
    element: <CustomerOrderHistory />
  },
      {
        path: "/HistoryOrderDetails/:id",
        element: <HistoryOrderDetails />
      }
]);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
