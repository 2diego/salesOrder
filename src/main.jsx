import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Orders from './pages/Admin/Orders/Orders.jsx';
import Reports from './pages/Admin/Reports/Reports.jsx';
import Manage from './pages/Admin/Manage/Manage.jsx';
import Profile from './pages/Admin/Profile/Profile.jsx';
import NewOrder from './pages/Customer/NewOrder.jsx';
import Adminlayout from './layouts/AdminLayout.jsx';
import OrderHistory from './pages/Admin/Manage/OrderHistory.jsx';
import Cart from './pages/Customer/Cart.jsx';
import AdminSellers from './pages/Admin/Manage/AdminSellers.jsx';
import AdminProducts from './pages/Admin/Manage/AdminProducts.jsx';
import AdminClients from './pages/Admin/Manage/AdminClients.jsx';
import CustomerOrderHistory from './pages/Customer/CustomerOrderHistory.jsx';
import HistoryOrderDetails from './pages/Customer/HistoryOrderDetails.jsx';

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
    path: "/HistoryOrderDetails",
    element: <HistoryOrderDetails />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
